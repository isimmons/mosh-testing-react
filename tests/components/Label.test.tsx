import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";

describe("Label", () => {
  const renderComponent = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  type TranslationObj = {
    labelId: string;
    language: Language;
    text: string;
  };

  it.each<TranslationObj>([
    // English
    { labelId: "welcome", language: "en", text: "Welcome" },
    { labelId: "new_product", language: "en", text: "New Product" },
    { labelId: "edit_product", language: "en", text: "Edit Product" },
    // Spanish
    { labelId: "welcome", language: "es", text: "Bienvenidos" },
    { labelId: "new_product", language: "es", text: "Nuevo Producto" },
    { labelId: "edit_product", language: "es", text: "Editar Producto" },
    // Japanese
    { labelId: "welcome", language: "ja", text: "Irasshaimase" },
    { labelId: "new_product", language: "ja", text: "Shinseihin" },
    { labelId: "edit_product", language: "ja", text: "Seihin O Henshū Suru" },
  ])(
    "should render $labelId in the $language language",
    ({ labelId, language, text }) => {
      renderComponent(labelId, language);
      expect(screen.getByRole("label", { name: text })).toBeInTheDocument();
    }
  );
});
