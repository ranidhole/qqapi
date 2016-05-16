const BUCKETS = {
  CLIENTS: {
    ALL: [
      10, 15, 20, 30, 25, 23, 9, 4, 1, 16, 19, 21, 24,
      22, 8, 17, 5, 28, 12, 29, 31, 26, 18, 2, 3, 11, 14, 33, 35,
    ],
    PENDING_FEEDBACK: [
      25, 23, 9, 4, 1, 16, 26,
    ],
    SHORTLISTED: [
      19, 21, 24, 22, 8, 17, 5, 12, 33,
    ],
    REJECTED: [
      18, 2, 3, 11, 14,
    ],
  },
  CONSULTANTS: {
    ALL: [
      24, 22, 33, 6, 32, 19, 35, 8, 5, 17, 12, 21, 23, 25, 9, 4, 10,
      15, 20, 36, 28, 29, 30, 31, 13, 14, 2, 3, 18, 11, 39, 40, 38, 27,
      41, 1, 16, 34, 26, 42,
    ],
    TASKS: [
      24, 22, 33, 6, 32, 19, 35, 8, 5, 17, 12, 21,
    ],
    SHORTLISTED: [
      24, 22, 33, 19, 35, 8, 5, 17, 12, 21, 23, 25, 9, 4, 10, 15, 20, 36, 28, 29, 30, 31,
    ],
    FEEDBACK: [
      23, 25, 9, 4, 27, 1, 41, 16, 34, 26, 39,
    ],
    REJECTED: [
      13, 14, 2, 3, 18, 11, 39, 40, 38,
    ],
  },
  QUEZX: {
    ALL: [
      10, 15, 20, 30, 25, 23, 9, 4, 1, 16, 19, 21, 24,
      22, 8, 17, 5, 28, 12, 29, 31, 26, 18, 2, 3, 11, 14, 33,
    ],
    PENDING_FEEDBACK: [
      25, 23, 9, 4, 1, 16, 26,
    ],
    SHORTLISTED: [
      19, 21, 24, 22, 8, 17, 5, 12, 33,
    ],
    REJECTED: [
      18, 2, 3, 11, 14,
    ],
  },
  // Todo: Database mappings
  GROUPS: {
    GLORY_CLIENTS: 1,
    CONSULTANTS: 2,
    CANDIDATES: 3,
    INTERNAL_TEAM: 4,
    UBER_CLIENT_RECRUITERS: 5,
    NORMAL_USER: 6,
    QUEZX_AND_QUARC_CONSULTANT: 7,
    SCREENING: 8,
    ADMIN_UBER: 9,
    BUSINESS_TEAM: 10,
    INTERNAL_TEAM_UBER: 11,
    UBER_CLIENT_FINANCE: 12,
  },
};

module.exports = BUCKETS;
