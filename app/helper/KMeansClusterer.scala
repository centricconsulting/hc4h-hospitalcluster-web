package helper

import collection.JavaConversions._

import org.apache.commons.math3.ml.clustering._
import org.apache.commons.math3.stat.StatUtils._
import models.FacilityRanking

case class ClusterableFacility(facility:FacilityRanking, var cluster:Int = 0, var weight:Double = 0) extends Clusterable {
  def getPoint: Array[Double] = {Array(facility.averageCharges)}
}

object KMeansClusterer {
  def clusterVals(toCluster:Seq[FacilityRanking]) : Seq[ClusterableFacility] = {
    val charges = toCluster.map(_.averageCharges).toArray
    val sd = Math.sqrt(variance(charges))
    val numClusters = Math.floor((max(charges) - min(charges))/sd).toInt

    val clusterer = new KMeansPlusPlusClusterer[ClusterableFacility](numClusters, 10)
    val facilities = toCluster.map(new ClusterableFacility(_))
    val clustered = clusterer.cluster(facilities)
    clustered.map{l =>
      val fs = l.getPoints
      val avg = fs.map(_.facility.averageCharges).sum / fs.length
      l.getPoints.foreach(_.weight = avg)
    }
    var index = 0
    clustered.sortBy(_.getPoints()(0).weight).foreach{lst => index = index+1; lst.getPoints.foreach(_.cluster = index)}

    facilities
  }
}
