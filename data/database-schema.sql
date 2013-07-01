-- To read the data files into a copy of postgres, first trim the header line from the datafile, then execute the following command (with your location for your trimmed datafile) at the psql shell:
-- copy patient_charges from '<location to Medicare_Provider_Charge_Inpatient_DRG100_FY2011.csv>' csv;

-- Note that the Survey_of_Patients__Hospital_Experiences__HCAHPS_.csv file must first be pre-processed to remove percentage symbols from numeric data columns
-- preprocess-survey-data.R or similar means will do pre-processing

drop table if exists patient_charges;
create table patient_charges (
  treatment varchar(1000) not null,
  provider_id int not null,
  provider_name varchar(500) not null,
  provider_address varchar(500) not null,
  provider_city varchar(75) not null,
  provider_state varchar(2) not null,
  provider_zip varchar(5) not null,
  referral_region varchar(50) not null,
  total_discharges int not null,
  average_covered_charges float not null,
  average_total_payments float not null
);

drop table if exists survey_results;
create table survey_results (
  provider_id int not null,
  provider_name varchar(500) not null,
  provider_address varchar(500) not null,
  provider_address2 varchar(500),
  provider_address3 varchar(500),
  provider_city varchar(75) not null,
  provider_state varchar(2) not null,
  provider_zip varchar(5) not null,
  provider_county varchar(50) not null,
  provider_phone varchar(15) not null,
  nurses_sometimes_never_communicated_well int,
  nurses_usually_communicated_well int,
  nurses_always_communcated_well int,
  doctors_sometimes_never_communicated_well int,
  doctors_usually_communicated_well int,
  doctors_always_communcated_well int,
  patient_sometimes_never_received_help int,
  patient_usually_received_help int,
  patient_always_received_help int,
  pain_sometimes_never_controlled int,
  pain_usually_controlled int,
  pain_always_controlled int,
  staff_sometimes_never_explained_medicine int,
  staff_usually_explained_medicine int,
  staff_always_explained_medicine int,
  bathroom_sometimes_never_clean int,
  bathroom_usually_clean int,
  bathroom_always_clean int,
  area_sometimes_never_quiet int,
  area_usually_quiet int,
  area_always_quiet int,
  info_about_recovery_given int,
  info_about_recovery_not_given int,
  rated_0_to_6 int,
  rated_7_to_8 int,
  rated_9_to_10 int,
  patient_would_not_recommend int,
  patient_probably_recommend int,
  patient_definitely_recommend int,
  number_of_completed_surveys varchar(50) not null,
  survey_response_rate int,
  footnotes varchar(2000)
);

copy patient_charges from '/Users/stetzer/code-projects/code4health/data/Medicare_Provider_Charge_Inpatient_DRG100_FY2011.csv.noheader' csv;
copy survey_results from '/Users/stetzer/code-projects/code4health/data/Survey_of_Patients__Hospital_Experiences__HCAHPS_.csv.processed' csv;

vacuum full analyze;
