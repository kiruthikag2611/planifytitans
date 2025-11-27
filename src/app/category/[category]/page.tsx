
"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useQuestionnaire } from "@/context/QuestionnaireProvider";

const subCategories = {
  academics: ["Student", "Professor", "Management"],
  personal: ["Student"],
};

export default function SubCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { setCategory, setSubCategory } = useQuestionnaire();
  const category = Array.isArray(params.category) ? params.category[0] : params.category;

  const validCategories = Object.keys(subCategories);
  if (!validCategories.includes(category)) {
    if (typeof window !== "undefined") {
      router.push("/category");
    }
    return null;
  }

  const handleSelect = (sub: string) => {
    if (category === 'academics' || category === 'personal') {
      setCategory(category);
    }
    if (sub.toLowerCase() === 'student' || sub.toLowerCase() === 'professor' || sub.toLowerCase() === 'management') {
      setSubCategory(sub.toLowerCase() as "student" | "professor" | "management");
    }

    const nextPath = `/q/${category}/${sub.toLowerCase()}/0`;
    router.push(nextPath);
  };

  const options = subCategories[category as keyof typeof subCategories];
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Link href="/category" className="absolute top-8 left-8 flex items-center gap-2 text-primary">
         <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold font-headline">
            {categoryTitle}: Select Your Role
          </h1>
          <p className="text-muted-foreground">This helps us tailor the experience for you.</p>
          <div className="flex flex-col gap-4 mt-8 w-full">
            {options.map((sub) => (
              <Button
                key={sub}
                onClick={() => handleSelect(sub)}
                variant="outline"
                size="lg"
                className="justify-center py-8 text-lg"
              >
                {sub}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </main>
  );
}
