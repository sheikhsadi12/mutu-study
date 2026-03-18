import { Passage } from '../types';

export const SAMPLE_PASSAGE: Passage = {
  id: "p1",
  passageNo: "01",
  board: "DB",
  year: "25",
  en: "There can be no progress without efforts and interest. A dull and lazy person can never shine in life. Life is a constant struggle. We have to fight against all odds to achieve our desired goals. Many great men rose from humble backgrounds through sheer determination and perseverance.",
  bn: "প্রচেষ্টা ও আগ্রহ ছাড়া কোনো উন্নতি সম্ভব নয়। একজন অলস ও নিষ্প্রভ ব্যক্তি জীবনে কখনো উজ্জ্বল হতে পারে না। জীবন একটি নিরন্তর সংগ্রাম।",
  words: [
    {id: "A", word: "Progress", pron: "প্রো-গ্রেস", pos: "Noun/Verb", bn: "উন্নতি, প্রগতি", exEn: "Hard work is the key to progress.", exBn: "পরিশ্রমই উন্নতির চাবিকাঠি।", type: "syn", items: [["Improvement", "ইমপ্রুভমেন্ট", "সংস্কার বা উৎকর্ষ সাধন"], ["Advance", "অ্যাডভান্স", "অগ্রসর হওয়া"], ["Development", "ডেভেলপমেন্ট", "উন্নয়ন বা বিকাশ"]]},
    {id: "B", word: "Efforts", pron: "এফ-অর্টস", pos: "Noun", bn: "প্রচেষ্টা, পরিশ্রম", exEn: "Success requires consistent efforts.", exBn: "সাফল্যের জন্য ধারাবাহিক প্রচেষ্টা প্রয়োজন।", type: "syn", items: [["Attempts", "অ্যাটেম্পটস", "চেষ্টা বা উদ্যোগ"], ["Endeavors", "এন্ডেভারস", "অধ্যবসায়"], ["Exertions", "এক্সার্শনস", "শ্রম বা কঠোর পরিশ্রম"]]},
    {id: "C", word: "Interest", pron: "ইন্টেরেস্ট", pos: "Noun/Verb", bn: "আগ্রহ, মনোযোগ", exEn: "Show interest in your studies.", exBn: "পড়াশোনায় আগ্রহ দেখাও।", type: "syn", items: [["Curiosity", "কিউরিওসিটি", "কৌতূহল"], ["Enthusiasm", "এনথুসিয়াজম", "উৎসাহ"], ["Passion", "প্যাশন", "তীব্র আগ্রহ"]]},
    {id: "D", word: "Shine", pron: "শাইন", pos: "Verb", bn: "উজ্জ্বল হওয়া", exEn: "Stars shine brightly at night.", exBn: "রাতে তারা উজ্জ্বলভাবে জ্বলে।", type: "syn", items: [["Excel", "এক্সেল", "শ্রেষ্ঠত্ব অর্জন"], ["Flourish", "ফ্লারিশ", "বিকশিত হওয়া"], ["Prosper", "প্রসপার", "সমৃদ্ধ হওয়া"]]},
    {id: "E", word: "Struggle", pron: "স্ট্রাগল", pos: "Noun/Verb", bn: "সংগ্রাম, লড়াই", exEn: "Life is full of struggle and pain.", exBn: "জীবন সংগ্রাম ও কষ্টে ভরা।", type: "ant", items: [["Peace", "পিস", "শান্তি"], ["Ease", "ইজ", "সহজতা"], ["Comfort", "কমফোর্ট", "আরাম"]]},
    {id: "F", word: "Dull", pron: "ডাল", pos: "Adjective", bn: "নিষ্প্রভ, অনুজ্জ্বল", exEn: "A dull mind never creates greatness.", exBn: "নিষ্প্রভ মন কখনো মহত্ত্ব সৃষ্টি করে না।", type: "ant", items: [["Bright", "ব্রাইট", "উজ্জ্বল"], ["Brilliant", "ব্রিলিয়ান্ট", "অত্যন্ত মেধাবী"], ["Vivid", "ভিভিড", "প্রাণবন্ত"]]},
    {id: "G", word: "Lazy", pron: "লেজি", pos: "Adjective", bn: "অলস, কর্মবিমুখ", exEn: "Lazy people never achieve success.", exBn: "অলস মানুষ কখনো সফল হয় না।", type: "ant", items: [["Diligent", "ডিলিজেন্ট", "পরিশ্রমী"], ["Industrious", "ইন্ডাস্ট্রিয়াস", "কর্মঠ"], ["Active", "অ্যাক্টিভ", "সক্রিয়"]]},
  ],
  chatHistory: [],
  savedContent: []
};
