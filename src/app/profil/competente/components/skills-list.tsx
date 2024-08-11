'use client';

import { Skill, SkillLevel } from "@prisma/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { SkillForm } from "./skill-form";
import { deleteSkill } from "../actions/skill-actions";
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

const skillLevelColors: Record<SkillLevel, string> = {
  BEGINNER: "bg-blue-100 text-blue-800",
  INTERMEDIATE: "bg-green-100 text-green-800",
  ADVANCED: "bg-yellow-100 text-yellow-800",
  EXPERT: "bg-red-100 text-red-800",
};

export function SkillsList({ skills }: { skills: Skill[] }) {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);
      toast({
        title: "Competență ștearsă",
        description: "Competența a fost ștearsă cu succes.",
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la ștergerea competenței.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill.id} className="flex items-center justify-between p-2 rounded shadow">
            <div>
              <span className="font-medium">{skill.name}</span>
              <Badge className={`ml-2 ${skillLevelColors[skill.level]}`}>
                {skill.level}
              </Badge>
            </div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingSkill(skill)}
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
                      Această acțiune nu poate fi anulată. Aceasta va șterge permanent competența din profilul tău.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Anulează</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(skill.id)}>
                      Șterge
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </li>
        ))}
      </ul>
      {editingSkill && (
        <SkillForm
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
        />
      )}
    </div>
  );
}