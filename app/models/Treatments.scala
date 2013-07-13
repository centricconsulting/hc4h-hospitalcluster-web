package models

import anorm._
import play.api.db._
import play.api.Play._

case class TreatmentGroup(id:Int, description:String)

object Treatments {
  def findAllTreatments : Seq[TreatmentGroup] = {
    DB.withConnection { implicit connection =>
      SQL("select id, description from treatment_groups")
        .apply()
        .map{ row =>
          TreatmentGroup(row[Int]("id"), row[String]("description"))
        }
        .toList
    }
  }
}
