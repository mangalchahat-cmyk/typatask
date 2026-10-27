type GreetingProps = {
  name: string;
};

function Greeting(props: GreetingProps): string {
  return "Hello " + props.name;
}

document.body.textContent = Greeting({ name: "Bishwas" });
