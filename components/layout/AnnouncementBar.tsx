import { CONTENT } from "@/lib/content/pl";

const { announcement: a } = CONTENT;

export function AnnouncementBar() {
  return (
    <div className="bg-ink-hi text-ink-inv text-center py-2.5 text-[12.5px] leading-[1.55] tracking-[0.02em]">
      {a.freeShipping}
      <span className="mx-3 opacity-30">·</span>
      {a.roastSchedule}
    </div>
  );
}
