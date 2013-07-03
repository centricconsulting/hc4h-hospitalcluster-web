package models

import anorm._
import play.api.Play._
import play.api.db._

case class HealthcareProvider (name:String, providerId:Int, city:String, state:String, zip:String, averageCoveredCharges:Double)

object HealthcareProvider {
  def findByTreatment(treatment:String) : Seq[HealthcareProvider] = {
    DB.withConnection{ implicit connection =>
      SQL("""select provider_name, provider_id, provider_city, provider_state, provider_zip, average_covered_charges
             from patient_charges p join treatments t on t.id=p.treatment_id
             where d.description={treatment}""")
      .on("treatment" -> treatment)
      .apply()
      .map( row =>
        HealthcareProvider(row[String]("provider_name"), row[Int]("provider_id"), row[String]("provider_city"), row[String]("provider_state"),
          row[String]("provider_zip"), row[Double]("average_covered_charges"))
      ).toList
    }
  }
}
