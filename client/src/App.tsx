import { Switch, Route } from "wouter";
import Game from "@/pages/Game";

function App() {
  return (
    <Switch>
      <Route path="/" component={Game} />
    </Switch>
  );
}

export default App;
