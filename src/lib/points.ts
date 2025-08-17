import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type AwardKind = "new_place" | "photo" | "edit" | "review";

const AWARDS: Record<AwardKind, number> = {
  new_place: 10,
  photo: 4,
  edit: 3,
  review: 2
};

export async function awardPoints(userId: string, kind: AwardKind) {
  const amount = AWARDS[kind] ?? 1;
  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: amount } }
  });
}
