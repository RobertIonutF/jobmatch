'use client';

import { Education } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { EducationForm } from "./education-form";
import { deleteEducation } from "../actions/education-actions";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function EducationList({ educations }: { educations: Education[] }) {
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteEducation(id);
      toast({
        title: "Educație ștearsă",
        description: "Înregistrarea educațională a fost ștearsă cu succes.",
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la ștergerea înregistrării educaționale.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {educations.map((education) => (
        <Card key={education.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{education.degree} la {education.institution}</span>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingEducation(education)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Această acțiune nu poate fi anulată. Aceasta va șterge permanent înregistrarea educațională.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anulează</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(education.id)}>
                        Șterge
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Perioada:</strong> {new Date(education.startDate).toLocaleDateString('ro-RO')} - {education.endDate ? new Date(education.endDate).toLocaleDateString('ro-RO') : 'Prezent'}</p>
            <p><strong>Domeniu de studiu:</strong> {education.fieldOfStudy}</p>
            <p><strong>Descriere:</strong> {education.description}</p>
          </CardContent>
        </Card>
      ))}
      {editingEducation && (
        <EducationForm
          education={editingEducation}
          onClose={() => setEditingEducation(null)}
        />
      )}
    </div>
  );
}