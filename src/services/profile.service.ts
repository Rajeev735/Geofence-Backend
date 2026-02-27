import User from "../Models/User";

export const getMyProfileService = async (userId: string) => {
  return User.findById(userId)
    .select("-password")
    .populate("organizationId", "org email country state")
    .populate("branchId", "branchName countryName stateName")
    .populate("zoneId", "zoneName");
};

export const updateMyProfileService = async (
  userId: string,
  updates: any
) => {
  return User.findByIdAndUpdate(userId, updates, {
    new: true
  })
    .select("-password")
    .populate("organizationId", "org email country state")
    .populate("branchId", "branchName countryName stateName")
    .populate("zoneId", "zoneName");
};