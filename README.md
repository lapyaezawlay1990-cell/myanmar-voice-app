# မြန်မာအသံ (Myanmar Voice) — စတင်အသုံးပြုရန်

ဒီဖိုင်တွေက Android ဖုန်း browser မှာ သုံးနိုင်တဲ့ web-app starter ဖြစ်ပါတယ်။ App အပြည့်အဝ အလုပ်လုပ်ဖို့ server တစ်ခု၊ OpenAI API key နဲ့ FFmpeg လိုအပ်ပါတယ်။ HTML ဖိုင်ကို ဖုန်းထဲမှာ တိုက်ရိုက်ဖွင့်ရုံနဲ့ ဘာသာပြန်စနစ် မအလုပ်လုပ်ပါ။

## ပါဝင်တဲ့အရာများ
- Video upload
- မူရင်းအသံကို transcript ပြုလုပ်ခြင်း
- မြန်မာဘာသာပြန်စာသား
- AI voice preset ရွေးချယ်ခြင်း
- စာသားပြင်ခြင်းနှင့် copy
- MP4 voiceover ထုတ်ခြင်း
- SRT subtitle file ထုတ်ခြင်း

## အရေးကြီးတဲ့ ကန့်သတ်ချက်များ
- API အသုံးပြုမှုအတွက် ကုန်ကျစရိတ်ရှိနိုင်ပါတယ်။ API key ကို လုံခြုံစွာ သိမ်းပါ၊ ဘယ်သူ့ကိုမှ မပေးပါနဲ့။
- AI voice preset `nova` / `onyx` ကို မိန်းကလေး/ယောက်ျားလေး ရွေးချယ်မှုအဖြစ် ချိတ်ထားပေမယ့် အသံလိင်/မြန်မာအသံထွက်ကို အာမမခံနိုင်ပါ။
- ဒီ starter version က မြန်မာအသံထည့်ပြီး MP4 ထုတ်ပေးပါတယ်။ မူရင်းအသံကို အစားထိုးပါတယ်။
- SRT ထဲမှာ ဘာသာပြန်စာတစ်ခုလုံးကို clip အချိန်တစ်ခုလုံးအတွက် ထည့်ထားပါတယ်။ စကားပြောတစ်ကြောင်းချင်း အချိန်ကိုက်စာတန်းထိုး မပါသေးပါ။
- မြန်မာဘာသာပြန်နဲ့ အသံထွက်ကို အရေးကြီးတဲ့အသုံးပြုမှုမတိုင်မီ ကိုယ်တိုင်စစ်ပါ။
- တခြားသူပိုင် video ကို တင်/ပြန်ဖြန့်မီ အသုံးပြုခွင့်ရှိကြောင်း သေချာပါစေ။

## Server မှာ run လုပ်ရန်
လိုအပ်ချက်: Node.js 20+, FFmpeg installed, OpenAI API key.

1. ဒီ project ကို server hosting (ဥပမာ Node.js ကို support လုပ်တဲ့ hosting) မှာ တင်ပါ။
2. Environment variables သတ်မှတ်ပါ:
   - `OPENAI_API_KEY` = ကိုယ်ပိုင် API key
   - `FFMPEG_PATH` = ffmpeg executable path (hosting မှာ `ffmpeg` command အဖြစ် ရရှိရင် မလိုပါ)
3. Project folder ထဲမှာ `npm install` လုပ်ပါ။
4. `npm start` လုပ်ပါ။
5. Browser မှာ server ရဲ့ HTTPS URL ကို ဖွင့်ပါ။ HTTPS သုံးတာက clipboard/download အတွက်လည်း ပိုသင့်တော်ပါတယ်။

## ဖုန်းတစ်လုံးတည်းနဲ့ လုပ်မယ်ဆိုရင်
Android Chrome ကနေ Node.js hosting ဝန်ဆောင်မှုကို ဖွင့်ပြီး project ဖိုင်တွေ upload လုပ်နိုင်ပါတယ်။ Hosting provider ရဲ့ UI အလိုက် အဆင့်တွေ ကွာနိုင်ပါတယ်။ API key ကို chat, public source code, screenshot တို့ထဲ မထည့်ပါနဲ့။

## Render မှာ Docker နဲ့တင်ရန် (အခမဲ့အစမ်းသုံးမှု)
1. GitHub အကောင့်ဖွင့်ပြီး project ဖိုင်များကို private repository ထဲတင်ပါ။ API key ကို repository ထဲ မထည့်ပါနှင့်။
2. Render တွင် New > Web Service ကိုရွေးပြီး GitHub repository ကိုချိတ်ပါ။
3. Runtime ကို Docker အဖြစ်ရွေးပါ။ Dockerfile က FFmpeg ကို install လုပ်ပေးသည်။
4. Environment Variables ထဲမှာ `OPENAI_API_KEY` ကို သတ်မှတ်ပါ။
5. Deploy ပြီးရင် Render ပေးတဲ့ HTTPS URL ကို ဖုန်း Chrome မှာ ဖွင့်ပါ။

သတိ: Hosting provider-уудын free plan, build limits, sleep policy, account verification, current pricing өөрчлөгдөжနိုင်ပါတယ်။ AI API key အသုံးပြုခကို hosting free plan က မဖုံးလွှမ်းပါ။ တင်မီ provider ရဲ့ လက်ရှိအစီအစဉ်ကို စစ်ဆေးပါ။
