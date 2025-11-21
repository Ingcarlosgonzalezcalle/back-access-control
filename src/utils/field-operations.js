
export const tipoName = (code) => {
  if (code == 1) { return "Amigo" }
  else if (code == 2) { return "Lider" }
  else if (code == 3) { return "Aliado" }
  else { return "NA" }
}


export const generoName = (code) => {
  if (code == 1) { return "Masculino" }
  else if (code == 2) { return "Femenino" }
  else { return "NA" }
}


export const tipoCandidatoName = (code) => {
  if (code == 1) { return "No Candidato" }
  else if (code == 2) { return "Candidato no elegido" }
  else if (code == 3) { return "Candidato elegido" }
  else { return "NA" }
}


export const corporacionName = (code) => {
  if (code == 1) { return "Edil" }
  else if (code == 2) { return "Concejo" }
  else if (code == 3) { return "Alcaldia" }
  else if (code == 4) { return "Asamblea" }
  else if (code == 5) { return "Gobernacion" }
  else if (code == 6) { return "Senado" }
  else if (code == 7) { return "Camara" }
  else { return "NA" }
}


export function calcularEdad(fechaNacimiento) {
  if (fechaNacimiento == "" || fechaNacimiento == null || fechaNacimiento == undefined) return "NA";
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = nacimiento.getMonth();
  const diaActual = hoy.getDate();
  const diaNacimiento = nacimiento.getDate();
  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
    edad--;
  }
  return edad;
}


export const capitalizeWords = (value) => {
  if (value) {
    const capitalized = value
      .split(' ')
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
    return capitalized;
  }
  return "";
};
