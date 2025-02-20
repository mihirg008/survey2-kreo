export type DemographicsL2Questions = {
  title: string
  questions: {
    id: string
    question: string
    type: "dropdown" | "radio"
    options: string[]
  }[]
}

export function getDemographicsL2Questions(age: string, gender: string): DemographicsL2Questions {
  if (age === "under18") {
    return {
      title: "Demographics L2",
      questions: [
        {
          id: "grade",
          question: "What grade/class are you in?",
          type: "dropdown",
          options: ["6th", "7th", "8th", "9th", "10th", "11th", "12th", "Other"],
        },
        {
          id: "parentControl",
          question: "Do your parents control your gaming time?",
          type: "radio",
          options: ["Yes, strictly", "Yes, but flexible", "No, I decide my own gaming schedule"],
        },
      ],
    }
  } else {
    const occupationOptions = [
      "College Student",
      "Software Engineer",
      "Designer/Marketer",
      "Content Creator",
      "Doctor/Lawyer",
      "Product Manager",
      "Founder/Director",
      "Self Employed",
      "Other",
    ]

    const questions: DemographicsL2Questions["questions"] = [
      {
        id: "occupation",
        question: "What do you do when you're not gaming? (Education/Occupation)",
        type: "dropdown",
        options: occupationOptions,
      },
    ]

    if (age === "25-34" || age === "35+") {
      questions.push({
        id: "maritalStatus",
        question: "What is your Marital Status?",
        type: "radio",
        options: ["Single", "In a Relationship", "Married", "Married with Kids", "It's complicated"],
      })
    }

    return {
      title: "Demographics L2",
      questions,
    }
  }
}

