-- Patient intake form
CREATE TABLE patients (
    id                INT           PRIMARY KEY AUTO_INCREMENT,
    first_name        VARCHAR(50)   NOT NULL,
    last_name         VARCHAR(50)   NOT NULL,
    email             VARCHAR(100)  NOT NULL UNIQUE,
    phone             VARCHAR(20)   NOT NULL,
    date_of_birth     DATE          NOT NULL,
    weight_lbs        FLOAT         NOT NULL,
    height_feet       INT           NOT NULL,
    height_inches     INT           NOT NULL,
    chief_complaint   VARCHAR(255)  NOT NULL,
    pain_level        INT           NOT NULL CHECK (pain_level BETWEEN 1 AND 10),
    symptoms_text     TEXT,
    allergies         TEXT,
    arrival_time      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Structured symptom selections (one row per symptom per patient)
CREATE TABLE patient_symptoms (
    id          INT           PRIMARY KEY AUTO_INCREMENT,
    patient_id  INT           NOT NULL,
    body_part   VARCHAR(50)   NOT NULL,
    symptom     VARCHAR(100)  NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Triage output: severity, priority, and queue placement
CREATE TABLE triage (
    id              INT           PRIMARY KEY AUTO_INCREMENT,
    patient_id      INT           NOT NULL,
    severity_level  INT           NOT NULL CHECK (severity_level BETWEEN 1 AND 5),
    priority_score  INT           NOT NULL,
    queue_position  INT           NOT NULL,
    status          VARCHAR(50)   DEFAULT 'waiting',  -- waiting | in-progress | discharged
    triaged_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Doctor-filled results after treatment
CREATE TABLE results (
    id              INT           PRIMARY KEY AUTO_INCREMENT,
    patient_id      INT           NOT NULL,
    diagnosis       VARCHAR(255)  NOT NULL,
    treatment       TEXT          NOT NULL,
    medication      TEXT          NOT NULL,
    diagnosis_date  DATE          NOT NULL,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Final archived medical record linking visit to results
CREATE TABLE medical_record (
    id             INT   PRIMARY KEY AUTO_INCREMENT,
    patient_id     INT   NOT NULL,
    result_id      INT,
    record_date    DATE  NOT NULL,
    p_description  TEXT  NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (result_id)  REFERENCES results(id)  ON DELETE SET NULL
);

-- Seed: test patient for MVP demo (OHIP: 1234-567-890, version: AB, DOB: 1990-01-15)
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, ohip_number, ohip_version_code, weight_lbs, height_feet, height_inches, chief_complaint, pain_level)
VALUES ('John', 'Doe', 'johndoe@test.com', '(555) 555-5555', '1990-01-15', '1234567890', 'AB', 180.0, 6, 0, 'GENERAL', 1);
