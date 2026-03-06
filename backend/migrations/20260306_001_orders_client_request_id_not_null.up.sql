BEGIN;

UPDATE orders
SET client_request_id = CONCAT('legacy-', id)
WHERE client_request_id IS NULL;

ALTER TABLE orders
ALTER COLUMN client_request_id SET NOT NULL;

COMMIT;
