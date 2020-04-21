import { GiMolecule } from "react-icons/gi";
import PDBInput from "../PDBInput";

export default {
  name: "protein",
  title: "Protein Data Bank",
  icon: GiMolecule,
  type: "object",
  inputComponent: PDBInput,
  fields: [
    {
      name: "pdb",
      title: "PDB",
      type: "string",
    },
    {
      type: "camera",
      name: "camera",
    },
  ],
  preview: {
    select: { pdb: "pdb" },
    prepare({ pdb }) {
      let title = "Protein Data Bank";
      return {
        title: pdb ? title + ": " + pdb : title,
      };
    },
  },
};
