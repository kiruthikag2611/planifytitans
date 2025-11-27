
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 relative">
       <Link href="/" className="absolute top-8 left-8">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      <div className="flex flex-col items-center gap-4 text-center w-full max-w-md">
        <h1 className="text-3xl font-bold font-headline">Which category best describes you?</h1>
        <p className="text-muted-foreground">Select one to get started.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 w-full">
          <Link href="/category/academics">
            <Card className="hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 py-8 shadow-md hover:shadow-xl">
              <CardHeader className="items-center gap-4">
                <GraduationCap className="h-12 w-12 text-primary" />
                <CardTitle className="font-headline text-2xl">Academics</CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/category/personal">
            <Card className="hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 py-8 shadow-md hover:shadow-xl">
              <CardHeader className="items-center gap-4">
                <User className="h-12 w-12 text-primary" />
                <CardTitle className="font-headline text-2xl">Personal</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
