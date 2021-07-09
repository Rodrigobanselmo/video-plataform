export const AscendentObject = function (a, b, field) {
  if (a[field].toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > b[field].toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
      return 1;
  }
  if (b[field].toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > a[field].toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
      return -1;
  }
  return 0;
};
export const Decrescent = function (a, b, field) {
  if (a[field].toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > b[field].toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
      return -1;
  }
  if (b[field].toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > a[field].toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
      return 1;
  }
  return 0;
};

export const Ascendent = function (a, b) {
  if (a.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > b.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
      return 1;
  }
  if (b.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "") > a.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9s]/g, "")) {
      return -1;
  }
  return 0;
};
