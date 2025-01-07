import { Switch, Route } from "wouter";
import Game from "@/pages/Game";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Game} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;