// This file holds the mock database for the Operator entity.
// The data structure follows the schema defined in Operator.json.
export let mockOperators = [
  {
    id: "op-1",
    name: "Alex Thompson",
    employee_id: "AXN-1001",
    status: "active",
    department: "long_haul",
    role: "long_haul_driver",
    certification_level: "expert",
    contact_email: "alex.t@axonlabs.com",
    contact_phone: "555-123-4567",
    photo_url: ""
  },
  {
    id: "op-2",
    name: "Sarah Chen",
    employee_id: "AXN-1002",
    status: "on_break",
    department: "regional",
    role: "regional_driver",
    certification_level: "senior",
    contact_email: "sarah.c@axonlabs.com",
    contact_phone: "555-987-6543",
    photo_url: ""
  },
  {
    id: "op-3",
    name: "Marcus Bell",
    employee_id: "AXN-1003",
    status: "off_duty",
    department: "local_delivery",
    role: "local_driver",
    certification_level: "standard",
    contact_email: "marcus.b@axonlabs.com",
    contact_phone: "555-555-1212",
    photo_url: ""
  },
];