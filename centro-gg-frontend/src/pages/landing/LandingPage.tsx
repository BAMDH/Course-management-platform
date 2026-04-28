import * as React from "react"
import { Link } from "react-router-dom"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const LandingPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>GG</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Bienvenido</CardTitle>
            <CardDescription>Plataforma educativa</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Explora cursos, inscríbete y gestiona tu progreso con nuestra
            plataforma amigable.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild>
            <Link to="/courses">Ver cursos</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

export default LandingPage
