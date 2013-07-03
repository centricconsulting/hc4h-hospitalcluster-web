package models

import anorm._
import play.api.db._
import play.api.Play._

object Treatments {
  def findAllTreatments : Seq[String] = {
    DB.withConnection { implicit connection =>
      SQL("select description from treatments").apply().map(_[String]("description")).toList
    }
  }
}
