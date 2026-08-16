import { pgTable, text, timestamp, uuid, decimal, integer, boolean, date, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('USER'), // USER, ADMIN, SUPERADMIN
  jobTitle: text('job_title'),
  status: text('status').notNull().default('Active'), // Active, Disabled
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastSeen: timestamp('last_seen').defaultNow(),
  lastIp: text('last_ip'),
  activeRequests: integer('active_requests').default(0),
  totalEarned: decimal('total_earned', { precision: 10, scale: 2 }).default('0'),
  completedShowings: integer('completed_showings').default(0),
  // Stripe
  stripeCustomerId: text('stripe_customer_id'),       // for paying as client
  stripeConnectId: text('stripe_connect_id'),         // for receiving as agent
  stripeConnectStatus: text('stripe_connect_status'), // pending | active | restricted
  defaultPaymentMethod: text('default_payment_method'), // Stripe PM id
});

export const requests = pgTable('requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => users.id).notNull(),
  serviceType: text('service_type').notNull(), // Showing, Open House, etc.
  status: text('status').notNull().default('PENDING'), // PENDING, ACTIVE, COMPLETED, CANCELLED
  compensation: decimal('compensation', { precision: 10, scale: 2 }).notNull(),
  // Payment
  paymentIntentId: text('payment_intent_id'),
  escrowStatus: text('escrow_status').default('NONE'), // NONE | HELD | RELEASED | REFUNDED
  transferId: text('transfer_id'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zip: text('zip').notNull(),
  mlsNumber: text('mls_number'),
  clientName: text('client_name'),
  clientPhone: text('client_phone'),
  accessNotes: text('access_notes'),
  lockboxCode: text('lockbox_code'),
  additionalNotes: text('additional_notes'),
  date: date('date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  agentId: uuid('agent_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  lastActive: timestamp('last_active').defaultNow(),
  isOnline: boolean('is_online').default(true),
});

export const supportRequests = pgTable('support_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  attachmentName: text('attachment_name'),
  attachmentUrl: text('attachment_url'),
  status: text('status').notNull().default('OPEN'), // OPEN, IN_PROGRESS, CLOSED
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  isFromAdmin: boolean('is_from_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const agentApplications = pgTable('agent_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Basic info
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  // License
  licenseNumber: text('license_number').notNull(),
  licenseState: text('license_state').notNull(),
  brokerageName: text('brokerage_name').notNull(),
  mlsId: text('mls_id'),
  // Services
  services: jsonb('services').notNull(), // string[]
  // Service area
  zipCode: text('zip_code').notNull(),
  radiusMiles: integer('radius_miles').notNull().default(25),
  willingToTravel: boolean('willing_to_travel').default(false),
  // Availability
  availableDays: jsonb('available_days').notNull(), // string[]
  acceptSameDay: boolean('accept_same_day').default(false),
  // Photo
  photoUrl: text('photo_url'),
  // Profile
  bio: text('bio'),
  specialties: jsonb('specialties'),
  languages: text('languages'),
  yearsOfExperience: text('years_of_experience'),
  // Status
  status: text('status').notNull().default('PENDING'), // PENDING, APPROVED, REJECTED, SUSPENDED
  adminNote: text('admin_note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const requestMessages = pgTable('request_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').references(() => requests.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').references(() => requests.id),
  fromUserId: uuid('from_user_id').references(() => users.id),
  toUserId: uuid('to_user_id').references(() => users.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  type: text('type').notNull(), // ESCROW | RELEASE | REFUND
  status: text('status').notNull().default('PENDING'), // PENDING | COMPLETED | FAILED
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripeTransferId: text('stripe_transfer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
