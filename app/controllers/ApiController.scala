package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json.Json

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

import models.Treatments

object ApiController extends Controller {
  def listTreatments = Action {
    val fTreatments = scala.concurrent.Future { Treatments.findAllTreatments }
    val fTimeout = play.api.libs.concurrent.Promise.timeout("Backend timeout", 2.seconds)
    Async {
      Future.firstCompletedOf(Seq(fTreatments, fTimeout)).map {
        case l: Seq[String] => Ok(Json.toJson(l))
        case s: String => InternalServerError(s)
      }
    }
  }
}
