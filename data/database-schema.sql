-- To read the data files into a copy of postgres, first trim the header line from the datafile, then execute the following command (with your location for your trimmed datafile) at the psql shell:
-- copy patient_charges from '<location to Medicare_Provider_Charge_Inpatient_DRG100_FY2011.csv>' csv;

-- Note that the Survey_of_Patients__Hospital_Experiences__HCAHPS_.csv file must first be pre-processed to remove percentage symbols from numeric data columns
-- preprocess-survey-data.R or similar means will do pre-processing

-- Note: requires postgis to be installed
--create extension postgis;
--create extension postgis_topology;
\set datapath '\'/Users/stetzer/code-projects/code4health/data'

drop table if exists facilities cascade;
create table facilities (
  id int not null primary key,
  name varchar(500) not null,
  address varchar(500) not null,
  city varchar(75) not null,
  state varchar(2) not null,
  zip varchar(5) not null,
  latitude float,
  longitude float
);

drop table if exists treatment_groups cascade;
create table treatment_groups (
  id serial primary key,
  description varchar(100) not null
);

drop table if exists treatments cascade;
create table treatments (
  id int not null primary key,
  description varchar(200) not null,
  treatment_group_id int references treatment_groups(id)
);

drop table if exists patient_charges cascade;
create table patient_charges (
  treatment varchar(250) not null,
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

drop table if exists survey_results cascade;
create table survey_results (
  provider_id int not null primary key,
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

drop table if exists facility_outcome_ranks cascade;
create table facility_outcome_ranks (
  id int not null primary key,
  rank float not null
);

copy facility_outcome_ranks from :datapath/Hospital_Outcome_Of_Care_Measures.csv.preprocessed' csv;

grant select on treatment_groups to wwwrun;
grant select on treatments to wwwrun;
grant select on patient_charges to wwwrun;
grant select on survey_results to wwwrun;
grant select on facilities to wwwrun;

-- General permissions required
grant select on spatial_ref_sys to wwwrun;

copy patient_charges from :datapath/Medicare_Provider_Charge_Inpatient_DRG100_FY2011.csv.noheader' csv;
copy survey_results from :datapath/Survey_of_Patients__Hospital_Experiences__HCAHPS_.csv.processed' csv;

insert into facilities (id, name, address, city, state, zip)
  select distinct provider_id, provider_name, provider_address, provider_city, provider_state, provider_zip from patient_charges;
alter table patient_charges add column facility_id int;
update patient_charges set facility_id=(select id from facilities where id=provider_id);
alter table patient_charges alter column facility_id set not null;
alter table patient_charges drop column provider_id;
alter table patient_charges drop column provider_name;
alter table patient_charges drop column provider_address;
alter table patient_charges drop column provider_city;
alter table patient_charges drop column provider_state;
alter table patient_charges drop column provider_zip;

-- TODO - this is messy, find a better way
truncate table facilities;
copy facilities from :datapath/facilities-geocoded.csv' csv;
alter table patient_charges add constraint "patient_charges_facility_id_fkey" foreign key (facility_id) references facilities(id);
alter table facilities add column geo_point geography;
update facilities set geo_point=ST_Point(longitude, latitude);
alter table facilities alter column geo_point set not null;

--insert into treatments (id, description) select distinct substr(treatment, 0, 4)::int, substr(treatment, 7, length(treatment)) from patient_charges;
truncate table treatment_groups cascade;
copy treatment_groups from 'C:\Code\HHC\hc4h-hospitalcluster-web\data\treatment_groups.csv' csv;
alter sequence public.treatment_groups_id_seq start with 20;

copy treatments from :datapath/treatments.csv' csv;
alter table patient_charges add column treatment_id int references treatments(id);
update patient_charges set treatment_id=(select id from treatments where id=substr(treatment, 0, 4)::int);
delete from patient_charges where treatment_id is null;
alter table patient_charges alter column treatment_id set not null;
alter table patient_charges drop column treatment;
alter table patient_charges add primary key(treatment_id, facility_id);

-- Add relative outcome ranks to facilities table, drop corresponding staging table
alter table facilities add column outcome_rank float;
update facilities f set outcome_rank=(select rank from facility_outcome_ranks where id=f.id);
-- 54 facilities have no ranking in the dataset, so let's assign them to the middle of the road
update facilities set outcome_rank=2346.72860188852 where outcome_rank is null;
alter table facilities alter column outcome_rank set not null;
drop table facility_outcome_ranks;

--vacuum full analyze;
