
import React from 'react';
import type { HealthTip } from './types';
import { Droplet, Leaf, Dumbbell, BrainCircuit } from 'lucide-react';


export const HEALTH_TIPS: HealthTip[] = [
  {
    icon: <Droplet className="h-8 w-8" />,
    title: "هیدراتاسیون",
    description: "روزانه حداقل ۸ لیوان آب بنوشید تا بدن خود را هیدراته و پرانرژی نگه دارید.",
  },
  {
    icon: <Leaf className="h-8 w-8" />,
    title: "رژیم غذایی متعادل",
    description: "از انواع میوه‌ها، سبزیجات و غلات کامل برای دریافت مواد مغذی ضروری استفاده کنید.",
  },
  {
    icon: <Dumbbell className="h-8 w-8" />,
    title: "ورزش منظم",
    description: "حداقل ۳۰ دقیقه فعالیت بدنی متوسط در بیشتر روزهای هفته را هدف قرار دهید.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: "سلامت روان",
    description: "برای کاهش استرس و بهبود خلق و خو، تمرینات ذهن‌آگاهی یا مدیتیشن را در نظر بگیرید.",
  },
];