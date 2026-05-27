CREATE TABLE `budget_groups` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`label` varchar(255) NOT NULL,
	`type` enum('hard','soft','contingency','other') NOT NULL DEFAULT 'hard',
	`sortOrder` int NOT NULL DEFAULT 0,
	`collapsed` boolean DEFAULT false,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budget_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `budget_lines` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`groupId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`budgetAmount` decimal(15,2) DEFAULT '0',
	`committedAmount` decimal(15,2) DEFAULT '0',
	`isContingency` boolean DEFAULT false,
	`contingencyPct` float,
	`sortOrder` int NOT NULL DEFAULT 0,
	`status` enum('open','fixed','closed') NOT NULL DEFAULT 'open',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budget_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `capital_stack_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`tier` enum('equity','mezzanine','senior_debt','junior_debt','other') NOT NULL,
	`label` varchar(255) NOT NULL,
	`lender` varchar(255),
	`amount` decimal(15,2) DEFAULT '0',
	`interestRate` float,
	`maturityDate` varchar(32),
	`ltc` float,
	`ltv` float,
	`status` enum('proposed','committed','funded','repaid') NOT NULL DEFAULT 'proposed',
	`sortOrder` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `capital_stack_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`vendorId` int,
	`vendorName` varchar(255),
	`contractDate` varchar(32),
	`contractTotal` decimal(15,2) DEFAULT '0',
	`totalPaid` decimal(15,2) DEFAULT '0',
	`totalRemaining` decimal(15,2) DEFAULT '0',
	`status` enum('draft','executed','complete','terminated') NOT NULL DEFAULT 'draft',
	`notes` text,
	`fileKey` varchar(500),
	`fileUrl` varchar(1000),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`name` varchar(500) NOT NULL,
	`category` varchar(128),
	`fileKey` varchar(500),
	`fileUrl` varchar(1000),
	`mimeType` varchar(128),
	`sizeBytes` int,
	`uploadedBy` varchar(255),
	`version` varchar(32),
	`status` enum('draft','current','superseded','archived') NOT NULL DEFAULT 'current',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `draw_line_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`drawId` int NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`budgetGroupId` varchar(64),
	`budgetLineId` varchar(64),
	`description` varchar(500),
	`scheduledValue` decimal(15,2) DEFAULT '0',
	`previouslyBilled` decimal(15,2) DEFAULT '0',
	`currentBilling` decimal(15,2) DEFAULT '0',
	`pctComplete` float,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `draw_line_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `draws` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`drawNumber` int NOT NULL,
	`label` varchar(255),
	`requestDate` varchar(32),
	`approvedDate` varchar(32),
	`fundedDate` varchar(32),
	`requestAmount` decimal(15,2) DEFAULT '0',
	`approvedAmount` decimal(15,2) DEFAULT '0',
	`fundedAmount` decimal(15,2) DEFAULT '0',
	`status` enum('draft','submitted','approved','funded','rejected') NOT NULL DEFAULT 'draft',
	`lender` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `draws_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`vendorId` int,
	`vendorName` varchar(255),
	`description` varchar(500),
	`division` varchar(128),
	`amount` decimal(15,2) DEFAULT '0',
	`expenseDate` varchar(32),
	`method` enum('wire','ach','check','zelle','deposit','other') DEFAULT 'wire',
	`referenceNumber` varchar(128),
	`invoiceNumber` varchar(128),
	`status` enum('pending','approved','paid','void') NOT NULL DEFAULT 'pending',
	`receiptKey` varchar(500),
	`receiptUrl` varchar(1000),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insurances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`vendorId` int,
	`companyName` varchar(255) NOT NULL,
	`subcontractorTrade` varchar(128),
	`contractSigned` boolean DEFAULT false,
	`subcontractorRider` boolean DEFAULT false,
	`additionalInsured` boolean DEFAULT false,
	`workersComp` boolean DEFAULT false,
	`generalLiabilityCarrier` varchar(255),
	`workersCompExpiration` varchar(32),
	`generalLiabilityExpiration` varchar(32),
	`status` enum('active','expiring','expired','missing') NOT NULL DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insurances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`address` varchar(500),
	`permitType` varchar(255),
	`agency` varchar(64),
	`permitNumber` varchar(128),
	`contractor` varchar(255),
	`contactPhone` varchar(64),
	`superintendent` varchar(255),
	`expiration` varchar(32),
	`status` enum('active','expiring','expired','pending') NOT NULL DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `permits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plan_task_groups` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plan_task_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plan_tasks` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`groupId` varchar(64),
	`sourceRow` int,
	`wbs` varchar(32),
	`name` varchar(500),
	`owner` varchar(255),
	`phase` varchar(128),
	`days` int,
	`startISO` varchar(32),
	`endISO` varchar(32),
	`pctComplete` float,
	`status` enum('Open','In Progress','Done','Blocked','Cancelled') DEFAULT 'Open',
	`bucket` varchar(64),
	`ganttX` float,
	`ganttW` float,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plan_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`fullName` varchar(255),
	`address` varchar(500),
	`phase` varchar(100),
	`phaseClass` varchar(32),
	`status` varchar(64),
	`statusClass` varchar(32),
	`totalBudget` decimal(15,2) DEFAULT '0',
	`units` int,
	`floors` int,
	`targetCompletion` varchar(64),
	`progress` int DEFAULT 0,
	`initials` varchar(8),
	`generalContractor` varchar(255),
	`projectStartDate` varchar(64),
	`scheduleStartISO` varchar(32),
	`scheduleEndISO` varchar(32),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stacking_plan_units` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`floor` int NOT NULL,
	`unitNumber` varchar(32) NOT NULL,
	`unitType` varchar(64),
	`bedrooms` int,
	`bathrooms` float,
	`sqft` int,
	`status` enum('available','reserved','contracted','closed','not_for_sale') NOT NULL DEFAULT 'available',
	`listPrice` decimal(15,2),
	`salePrice` decimal(15,2),
	`buyerName` varchar(255),
	`closingDate` varchar(32),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stacking_plan_units_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendor_bids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`vendorId` int NOT NULL,
	`vendorName` varchar(255),
	`division` varchar(128),
	`scope` text,
	`bidAmount` decimal(15,2) DEFAULT '0',
	`status` enum('pending','received','approved','rejected','contracted') NOT NULL DEFAULT 'pending',
	`bidDate` varchar(32),
	`expiryDate` varchar(32),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendor_bids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255),
	`email` varchar(320),
	`phone` varchar(64),
	`officePhone` varchar(64),
	`fax` varchar(64),
	`address` varchar(500),
	`trade` varchar(128),
	`category` varchar(128),
	`status` enum('active','inactive','pending') NOT NULL DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `budget_groups_project_idx` ON `budget_groups` (`projectId`);--> statement-breakpoint
CREATE INDEX `budget_lines_project_idx` ON `budget_lines` (`projectId`);--> statement-breakpoint
CREATE INDEX `budget_lines_group_idx` ON `budget_lines` (`groupId`);--> statement-breakpoint
CREATE INDEX `capital_stack_project_idx` ON `capital_stack_items` (`projectId`);--> statement-breakpoint
CREATE INDEX `contracts_project_idx` ON `contracts` (`projectId`);--> statement-breakpoint
CREATE INDEX `documents_project_idx` ON `documents` (`projectId`);--> statement-breakpoint
CREATE INDEX `draw_lines_draw_idx` ON `draw_line_items` (`drawId`);--> statement-breakpoint
CREATE INDEX `draw_lines_project_idx` ON `draw_line_items` (`projectId`);--> statement-breakpoint
CREATE INDEX `draws_project_idx` ON `draws` (`projectId`);--> statement-breakpoint
CREATE INDEX `expenses_project_idx` ON `expenses` (`projectId`);--> statement-breakpoint
CREATE INDEX `expenses_vendor_idx` ON `expenses` (`vendorId`);--> statement-breakpoint
CREATE INDEX `expenses_division_idx` ON `expenses` (`division`);--> statement-breakpoint
CREATE INDEX `insurance_project_idx` ON `insurances` (`projectId`);--> statement-breakpoint
CREATE INDEX `permits_project_idx` ON `permits` (`projectId`);--> statement-breakpoint
CREATE INDEX `plan_task_groups_project_idx` ON `plan_task_groups` (`projectId`);--> statement-breakpoint
CREATE INDEX `plan_tasks_project_idx` ON `plan_tasks` (`projectId`);--> statement-breakpoint
CREATE INDEX `plan_tasks_group_idx` ON `plan_tasks` (`groupId`);--> statement-breakpoint
CREATE INDEX `stacking_project_idx` ON `stacking_plan_units` (`projectId`);--> statement-breakpoint
CREATE INDEX `stacking_floor_idx` ON `stacking_plan_units` (`floor`);--> statement-breakpoint
CREATE INDEX `bids_project_idx` ON `vendor_bids` (`projectId`);--> statement-breakpoint
CREATE INDEX `bids_vendor_idx` ON `vendor_bids` (`vendorId`);--> statement-breakpoint
CREATE INDEX `vendors_project_idx` ON `vendors` (`projectId`);