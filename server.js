const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const app = express();
const upload = multer({
  dest: path.join(os.tmpdir(), "myanmar-voice-uploads"),
  limits: { fileSize: 300 * 1024 * 1024 }
});
const PORT = process.env.PORT || 3000;
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "2mb" }));

function client() {
  if (!process.env.OPENAI_API_KEY) {
    const err = new Error("Server မှာ OPENAI_API_KEY မသတ်မှတ်ရသေးပါ။ README.md ကိုကြည့်ပါ။");
    err.status = 503;
    throw err;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
function safeUnlink(p) { try { if (p && fs.existsSync(p)) fs.unlinkSync(p); } catch (_) {} }
function runFfmpeg(args) { return execFileAsync(FFMPEG, args, { timeout: 10 * 60 * 1000, maxBuffer: 10 * 1024 * 1024 }); }

app.get("/api/health", (_req, res) => res.json({ ok: true, ffmpegConfigured: true }));

app.post("/api/process", upload.single("video"), async (req, res) => {
  const files = [];
  try {
    if (!req.file) return res.status(400).json({ error: "Video ဖိုင်ကို အရင်ရွေးပါ။" });
    files.push(req.file.path);
    const ai = client();
    const voiceChoice = req.body.voice === "male" ? "onyx" : "nova";
    const originalPath = req.file.path;
    const audioPath = originalPath + ".mp3";
    const speechPath = originalPath + "-myanmar.mp3";
    const outputPath = originalPath + "-myanmar.mp4";
    files.push(audioPath, speechPath, outputPath);

    await runFfmpeg(["-y", "-i", originalPath, "-vn", "-ac", "1", "-ar", "16000", "-b:a", "96k", audioPath]);

    const transcription = await ai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "gpt-4o-mini-transcribe"
    });
    const sourceText = (transcription.text || "").trim();
    if (!sourceText) throw new Error("Video ထဲက စကားသံကို စာသားအဖြစ် မရယူနိုင်ပါ။ အသံကြားရတဲ့ Video ကို စမ်းပါ။");

    const translated = await ai.responses.create({
      model: "gpt-4.1-mini",
      instructions: "You are a careful English-to-Burmese and multilingual-to-Burmese translator. Translate the supplied transcript into natural, accurate written Burmese (Myanmar script). Preserve meaning, names, tone, and dialogue. Do not summarize. Return only the Burmese translation. If a phrase is unclear, translate conservatively rather than inventing details.",
      input: sourceText
    });
    const burmeseText = (translated.output_text || "").trim();
    if (!burmeseText) throw new Error("မြန်မာဘာသာပြန်စာသား မရရှိပါ။");

    const speech = await ai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voiceChoice,
      input: burmeseText.slice(0, 4000),
      instructions: "Speak Burmese clearly and naturally, at a moderate pace. Pronounce Myanmar words as accurately as possible. This is a Burmese voiceover."
    });
    fs.writeFileSync(speechPath, Buffer.from(await speech.arrayBuffer()));

    // Replace the source audio with Burmese voiceover. The video is shortened/extended
    // according to the voice track; original video is padded with its last frame if needed.
    await runFfmpeg([
      "-y", "-i", originalPath, "-i", speechPath,
      "-map", "0:v:0", "-map", "1:a:0",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
      "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart",
      outputPath
    ]);

    // A downloadable SRT is provided as a simple full-clip caption. Fine-grained timing
    // requires forced alignment and is not claimed by this starter version.
    const srtPath = originalPath + "-myanmar.srt";
    files.push(srtPath);
    const stamp = "00:00:00,000 --> 99:59:59,000";
    fs.writeFileSync(srtPath, `1\n${stamp}\n${burmeseText.replace(/\n/g, " ")}\n`, "utf8");

    const videoData = fs.readFileSync(outputPath).toString("base64");
    const srtData = fs.readFileSync(srtPath, "utf8");
    res.json({
      sourceText,
      burmeseText,
      voice: voiceChoice,
      videoBase64: videoData,
      subtitleSrt: srtData,
      note: "ဒီအစပြုဗားရှင်းမှာ စာတန်းတစ်ခုကို Clip တစ်ခုလုံးအတွက် ထုတ်ပေးထားပါတယ်။ စကားပြောချိန်နဲ့ စာတန်းချိန်ကို တစ်ကြောင်းချင်း အတိအကျကိုက်ညီစေခြင်း မပါသေးပါ။"
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.message || "လုပ်ဆောင်ရာတွင် အမှားဖြစ်သွားပါတယ်။ Video အရွယ်အစားနဲ့ API key ကို စစ်ပါ။"
    });
  } finally {
    files.forEach(safeUnlink);
  }
});

app.listen(PORT, () => console.log(`Myanmar Voice running on port ${PORT}`));
