outcomes <- read.csv("~/Downloads/Hospital_Outcome_Of_Care_Measures.csv", header=T, stringsAsFactors=F)
colnames(outcomes)[17] <- "HeartFailure"
colnames(outcomes)[23] <- "Pneumonia"
colnames(outcomes)[35] <- "ReadmissionHeartFailure"
colnames(outcomes)[41] <- "ReadmissionPneumonia"
export <- data.frame(id=outcomes$Provider.Number, mortality_heart_failure=outcomes$HeartFailure, mortality_pneumonia=outcomes$Pneumonia,
                     readmin_heart_failure=outcomes$ReadmissionHeartFailure,
                     readmin_pneumonia=outcomes$ReadmissionPneumonia, stringsAsFactors=F)
# Deal with NAs
export[is.na(export$mortality_heart_failure),]$mortality_heart_failure <- mean(export$mortality_heart_failure, na.rm=T)
export[is.na(export$mortality_pneumonia),]$mortality_pneumonia <- mean(export$mortality_pneumonia, na.rm=T)
export[is.na(export$readmin_heart_failure),]$readmin_heart_failure <- mean(export$readmin_heart_failure, na.rm=T)
export[is.na(export$readmin_pneumonia),]$readmin_pneumonia <- mean(export$readmin_pneumonia, na.rm=T)

# Ranks
export$rnk1 <- rank(export$mortality_heart_failure)
export$rnk2 <- rank(export$mortality_pneumonia)
export$rnk3 <- rank(export$readmin_heart_failure)
export$rnk4 <- rank(export$readmin_pneumonia)

# Composite rank
export$composite_rank <- rank(export$rnk1+export$rnk2+export$rnk3+export$rnk4)

write.table(data.frame(id=export$id, outcome_rank=export$composite_rank),
            file="~/code-projects/code4health/data/Hospital_Outcome_Of_Care_Measures.csv.preprocessed",
            na="", sep=",", quote=T, col.names=F, row.names=F)