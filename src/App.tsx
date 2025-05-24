import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-32 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <div className="w-4 h-4">
                <img src="/src/assets/logo.svg" alt="CodeHall Logo" className="w-full h-full" />
              </div>
              <span className="text-lg font-bold">CodeHall</span>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-8">
              {/* Nav Links */}
              <nav className="flex items-center gap-9">
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                  Product
                </a>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                  Pricing
                </a>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                  Docs
                </a>
              </nav>

              {/* Auth Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" className="h-10 px-4">
                  Sign up
                </Button>
                <Button variant="secondary" size="sm" className="h-10 px-4">
                  Log in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-32 py-8">
        <div className="flex items-center gap-8">
          {/* Left Image */}
          <div className="flex-shrink-0">
            <div className="w-96 h-80 rounded-3xl overflow-hidden">
              <img
                src="/src/assets/hero-image.png"
                alt="CodeHall Platform"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold leading-tight tracking-tight">
                Code together, anywhere
              </h1>
              <p className="text-base text-foreground leading-relaxed">
                CodeHall is a collaborative coding platform that allows you to code with
                your team in real-time. With built-in video chat, you can see and talk to your
                team while you code.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button size="lg" className="h-12 px-5">
                Sign up
              </Button>
              <Button variant="secondary" size="lg" className="h-12 px-5">
                Log in
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-32 py-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold tracking-tight">Features</h2>
            <p className="text-base text-foreground max-w-3xl mx-auto">
              CodeHall is packed with features to make collaborative coding easy and fun.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Real-time coding */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <div className="w-6 h-6">
                  <img src="/src/assets/realtime-icon.svg" alt="Real-time coding" className="w-full h-full" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold">Real-time coding</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Code together in real-time with your team. See each other's changes as they happen.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Video chat */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <div className="w-6 h-6">
                  <img src="/src/assets/video-icon.svg" alt="Video chat" className="w-full h-full" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold">Video chat</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    See and talk to your team while you code with built-in video chat.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Live chat */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <div className="w-6 h-6">
                  <img src="/src/assets/chat-icon.svg" alt="Live chat" className="w-full h-full" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold">Live chat</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Chat with your team in real-time with built-in live chat.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-32 py-8">
          <div className="space-y-4">
            {/* Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                Product
              </a>
              <a href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </a>
              <a href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-base text-muted-foreground">
                © 2023 CodeHall. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
