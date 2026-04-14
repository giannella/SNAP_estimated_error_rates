# 0. Libraries
library(ranger)
library(yardstick)
library(dplyr)
library(ggplot2)
library(scales)
library(haven)

cores <- parallel::detectCores() - 2

# 1. Load data
folder <- "~/Desktop/BGL/errors/"
df <- read_sav(paste0(folder, "qc_data/qc_pub_fy2023.sav"))

# 2. Add state names to dataset
state_data <- read.csv(paste0(folder, "additional_data/state_data.csv"))
fips_to_state <- setNames(state_data$state, as.character(state_data$fips))
df$state_name <- fips_to_state[as.character(df$STATE)]

### ERROR RATE CALCULATIONS ###

mydata <- df

# Only CASE == "Included in error rate calculation" is counted
mydata <- mydata %>%
  filter(CASE == 1)

# Flag errors with > 54 in error (the threshold for FY2023)
# Change this to 0 to do the new analysis
mydata <- mydata %>%
  mutate(in_error_rate = AMTERR > 54)

# Calculate countable error dollars for each case
mydata <- mydata %>%
  mutate(
    countable_error = if_else(in_error_rate, AMTERR, 0)
  )

# Aggregate up to state level using full-year weights
# It's RAWBEN and not FSBEN due to
# ".. where u is the average value of allotments issued ..."
# https://www.law.cornell.edu/cfr/text/7/275.23
mydata <- mydata %>%
  group_by(state_name) %>%
  summarise(
    wtd_error_dollars   = sum(countable_error * FYWGT, na.rm = TRUE),
    wtd_benefit_dollars = sum(RAWBEN * FYWGT, na.rm = TRUE)
  )

# Calculate the error rate
mydata <- mydata %>%
  mutate(
    error_rate_pct = (wtd_error_dollars / wtd_benefit_dollars) * 100
  ) 

# Results
print(mydata, n = 60)
