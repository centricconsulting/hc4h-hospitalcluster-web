survey <- read.csv("~/code-projects/code4health/data/Survey_of_Patients__Hospital_Experiences__HCAHPS_.csv",
                   header=T, comment.char="", stringsAsFactors=F)
survey.names <- names(survey)
survey.names <- survey.names[!survey.names %in% c(
  "Provider.Number",
  "Hospital.Name",
  "Address.1",
  "Address.2",
  "Address.3",
  "City",
  "State",
  "ZIP.Code",
  "County.Name",
  "Phone.Number",
  "Number.of.Completed.Surveys",
  "Hospital.Footnote"
  )
]

for(colName in survey.names) {
  survey[[colName]] <- as.numeric(gsub("%", "", survey[[colName]]))
}

write.table(survey,
            file="~/code-projects/code4health/data/Survey_of_Patients__Hospital_Experiences__HCAHPS_.csv.processed",
            na="", sep=",", quote=T, col.names=F, row.names=F)