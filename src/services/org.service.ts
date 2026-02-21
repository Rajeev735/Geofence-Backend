import Organization from "../Models/Organization";

export const createOrganization = async (data: {
  org: string;
  email: string;
  country: string;
  state: string;
}) => {
  const exists = await Organization.findOne({ email: data.email });
  if (exists) throw new Error("Organization already exists");

  return Organization.create(data);
};
