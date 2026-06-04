ALTER TABLE `vendor_documents` ADD `sourceType` enum('vendor','bid','expense') DEFAULT 'vendor' NOT NULL;--> statement-breakpoint
ALTER TABLE `vendor_documents` ADD `bidId` int;--> statement-breakpoint
ALTER TABLE `vendor_documents` ADD `expenseId` int;