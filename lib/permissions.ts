import { createAccessControl } from "better-auth/plugins/access";

// Define resources and their possible actions
export const statement = {
  userResource: ["create", "read", "update", "delete"], // For managing user accounts
  car: ["create", "read", "update", "delete"],
  ride: ["create", "read", "update", "delete"],
  organization: ["read", "update", "delete", "manageMembers", "manageInvitations"],
  member: ["create", "read", "update", "delete"], // Member within an organization
  invitation: ["create", "read", "update", "delete", "send"],
  // Add other resources specific to your application if needed
} as const;

export const ac = createAccessControl(statement);

// Define roles and their permissions

export const adminRole = ac.newRole({
  userResource: ["create", "read", "update", "delete"],
  car: ["create", "read", "update", "delete"],
  ride: ["create", "read", "update", "delete"],
  organization: ["read", "update", "delete", "manageMembers", "manageInvitations"],
  member: ["create", "read", "update", "delete"],
  invitation: ["create", "read", "update", "delete", "send"],
});

export const driverRole = ac.newRole({
  userResource: ["read"], // Drivers can view relevant user (customer) info
  car: ["create", "read", "update", "delete"], // Drivers can manage their own cars
  ride: ["create", "read", "update", "delete"], // Drivers can manage rides they are assigned to
  organization: ["read"], // Drivers can view basic organization info
  member: ["read"], // Drivers can see other members
  invitation: [], // Drivers typically don't manage invitations
});

export const userRole = ac.newRole({
  userResource: [], // Users cannot manage other user accounts
  car: ["read"], // Users might view cars
  ride: ["create", "read", "update"], // Users can create, view and update their own rides
  organization: ["read"], // Users can view basic organization info
  member: ["read"], // Users can see other members in their organization
  invitation: [],
});

export const allRoles = {
  admin: adminRole,
  driver: driverRole,
  user: userRole,
};
