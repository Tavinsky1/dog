type AwardKind = "new_place" | "photo" | "edit" | "review";

export async function awardPoints(userId: string, kind: AwardKind) {
  void userId;
  void kind;
  // Points system removed in the simplified MVP.
}
