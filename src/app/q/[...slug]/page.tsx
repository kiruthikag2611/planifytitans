
import { notFound } from 'next/navigation';
import { questions } from '@/lib/questions';
import { QuestionnaireClientPage } from '@/components/questionnaire/QuestionnaireClientPage';

type QuestionPageProps = {
  params: {
    slug: string[];
  };
};

export default function QuestionPage({ params }: QuestionPageProps) {
  const [category, subCategory, questionIndexStr] = params.slug;
  const questionIndex = parseInt(questionIndexStr, 10);

  if (
    !category ||
    !subCategory ||
    isNaN(questionIndex) ||
    !questions[category] ||
    !questions[category][subCategory]
  ) {
    return notFound();
  }

  const questionSet = questions[category][subCategory];
  const totalQuestions = questionSet.length;

  if (questionIndex < 0 || questionIndex >= totalQuestions) {
    return notFound();
  }

  const currentQuestion = questionSet[questionIndex];

  return (
    <div>
      <QuestionnaireClientPage
        category={category}
        subCategory={subCategory}
        questionIndex={questionIndex}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
      />
    </div>
  );
}
