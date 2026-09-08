async function loadGarageData() {
    const response = await fetch("data/garage.json");


  if (!response.ok) {
    throw new Error("Kunne ikke laste garage.json");
  }

  return await response.json();

}