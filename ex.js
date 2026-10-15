const FormateEmploymentType = (type) => {
      if(!type) return null;
      
      switch (type) {
        case "FULL_TIME":
          type = "Full Time"
          break;
        case "PART_TIME":
          type = "Part Time"
          break;  
        case "INTERNSHIP":
          type = "Internship"
          break;  
        case "CONTRACT":
          type = "Contract"
          break;  
        case "FREELANCE":
          type = "Freelance"
          break;
        default:
          type = "Full Time"
          break;
      }

      return type;
  }

  console.log(FormateEmploymentType("INTERNSHIP"));