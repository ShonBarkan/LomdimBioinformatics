import mongoose from "mongoose";

const { Schema } = mongoose;

const TagSchema = new Schema({
  tagName: {
    type: String,
    required: true,
  },
  tagColor: {
    type: String,
    default: "#000000",
  },
});

const SubInfoSchema = new Schema({
  infoTitle: {
    type: String,
    required: true,
  },
  infoDescription: {
    type: String,
    required: true,
  },
  subInfo: [
    {
      type: Schema.Types.Mixed, // recursive structure
    },
  ],
});

const SubjectTriviaSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answers: {
    type: [String],
    validate: [arrayLimit, "{PATH} must have exactly 4 answers."],
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

function arrayLimit(val) {
  return val.length === 4;
}

const SubjectSchema = new Schema(
  {
    subjectName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    courseName: {
      type: String,
      required: true,
    },
    youTubeUrl: {
      type: String,
      default: "",
    },
    audioUrl: {
      type: String,
      default: "",
    },
    tags: [TagSchema],
    info: [SubInfoSchema],
    subjectTrivia: [SubjectTriviaSchema],
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model("Subject", SubjectSchema);

export default Subject;
