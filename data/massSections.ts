import { MockProvider } from "./liturgicalProviders";

export const massSections = MockProvider.getMassCompanionSections().map((section) =>
  section.id === "offertory"
    ? {
        ...section,
        what: section.whatIsHappening,
        why: "Our gifts are joined to Jesus' sacrifice. We offer ourselves with Him.",
        how: "Offer your week, your family, your work, your suffering.",
        sourceRefs: [
          {
            label: "Sacred Scripture",
            citation: "Luke 22:19",
            note: "At the Last Supper, Christ takes bread, gives thanks, and gives it to the apostles; the Mass receives its pattern from the Lord's own action.",
            url: "https://www.vatican.va/archive/ENG0839/_PX5.HTM"
          },
          {
            label: "General Instruction of the Roman Missal",
            citation: "GIRM 73",
            note: "The gifts that will become Christ's Body and Blood are brought to the altar; the rite retains spiritual significance.",
            url: "https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_en.html"
          },
          {
            label: "Catechism of the Catholic Church",
            citation: "CCC 1350",
            note: "The bread and wine are offered in the name of Christ in the Eucharistic sacrifice.",
            url: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/iv_the_liturgical_celebration_of_the_eucharist.html"
          },
          {
            label: "Catechism of the Catholic Church",
            citation: "CCC 1333",
            note: "In the Offertory the Church gives thanks to the Creator for bread and wine, gifts of creation.",
            url: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/iii_the_eucharist_in_the_economy_of_salvation.html"
          }
        ]
      }
    : section
);
