'use client';

import { Project } from "@prisma/client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ProjectForm } from "./project-form";
import { deleteProject } from "../actions/project-actions";
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

export function ProjectList({ projects }: { projects: Project[] }) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      toast({
        title: "Proiect șters",
        description: "Proiectul a fost șters cu succes.",
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la ștergerea proiectului.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{project.title}</span>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingProject(project)}
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
                        Această acțiune nu poate fi anulată. Aceasta va șterge permanent proiectul din profilul tău.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anulează</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(project.id)}>
                        Șterge
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Perioada:</strong> {new Date(project.startDate).toLocaleDateString('ro-RO')} - {project.endDate ? new Date(project.endDate).toLocaleDateString('ro-RO') : 'Prezent'}</p>
            <p><strong>Descriere:</strong> {project.description}</p>
            {project.url && <p><strong>URL:</strong> <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{project.url}</a></p>}
          </CardContent>
        </Card>
      ))}
      {editingProject && (
        <ProjectForm
          project={editingProject}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}