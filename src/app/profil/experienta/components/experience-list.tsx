'use client';

import { Experience } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ExperienceForm } from "./experience-form";
import { deleteExperience } from "../actions/experience-actions";
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

export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteExperience(id);
      toast({
        title: "Experiență ștearsă",
        description: "Experiența a fost ștearsă cu succes.",
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la ștergerea experienței.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <Card key={experience.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{experience.jobTitle} la {experience.company}</span>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingExperience(experience)}
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
                        Această acțiune nu poate fi anulată. Aceasta va șterge permanent experiența ta profesională.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anulează</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(experience.id)}>
                        Șterge
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Perioada:</strong> {new Date(experience.startDate).toLocaleDateString('ro-RO')} - {experience.endDate ? new Date(experience.endDate).toLocaleDateString('ro-RO') : 'Prezent'}</p>
            <p><strong>Descriere:</strong> {experience.description}</p>
          </CardContent>
        </Card>
      ))}
      {editingExperience && (
        <ExperienceForm
          experience={editingExperience}
          onClose={() => setEditingExperience(null)}
        />
      )}
    </div>
  );
}