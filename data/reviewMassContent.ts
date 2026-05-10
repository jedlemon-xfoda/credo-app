import type { ContentMetadata, DynamicMassContentType } from "../types";

export type ProperTextStatus = "available" | "unavailable";

export type ProperText = {
  citation?: string;
  metadata: ContentMetadata;
  status: ProperTextStatus;
  text: string;
  title: string;
};

export type ReviewDayMassContent = {
  collect: ProperText;
  communionAntiphon: ProperText;
  date: string;
  gospel: ProperText;
  gospelAcclamationVerse: ProperText;
  prayerAfterCommunion: ProperText;
  prayerOverOfferings: ProperText;
  psalmResponse: ProperText;
  psalmVerses: ProperText;
  firstReading: ProperText;
  secondReading: ProperText;
};

const REVIEW_SOURCE = "USCCB review dataset";
const REVIEW_LICENSE_NOTE = "Review-only liturgical text for internal approver experience. Pending final approval; blocked from public production builds.";

export const unavailableProper: ProperText = {
  metadata: {
    approvalStatus: "draft",
    licensingNote: "No approved or review text is available for this proper.",
    reviewOnly: false,
    sourceProvider: "manual_review",
    textStatus: "placeholder"
  },
  status: "unavailable",
  text: "",
  title: "Unavailable"
};

function proper(date: string, contentType: DynamicMassContentType, title: string, text: string, citation?: string): ProperText {
  return {
    citation,
    metadata: {
      approvalStatus: "pending_review",
      canonicalSourceUrl: "local-review-dataset",
      contentType,
      lastUpdated: "2026-05-09",
      licensingNote: REVIEW_LICENSE_NOTE,
      liturgicalDate: date,
      reviewOnly: true,
      sourceProvider: "manual_review",
      textStatus: "review_only"
    },
    status: "available",
    text,
    title
  };
}

const MAY_9_2026 = "2026-05-09";
const MAY_10_2026 = "2026-05-10";
const MAY_11_2026 = "2026-05-11";
const NOVEMBER_1_2026 = "2026-11-01";

export const REVIEW_MASS_CONTENT: Record<string, ReviewDayMassContent> = {
  [MAY_9_2026]: {
    collect: proper(
      MAY_9_2026,
      "collect",
      "Collect",
      "Almighty and eternal God,\nwho through the regenerating power of Baptism\nhave been pleased to confer on us heavenly life,\ngrant, we pray,\nthat those you render capable of immortality\nmay by your guidance attain the fullness of glory.",
      REVIEW_SOURCE
    ),
    communionAntiphon: proper(
      MAY_9_2026,
      "communion_antiphon",
      "Communion Antiphon",
      "Father, I pray for them,\nthat they may be one in us,\nso that the world may believe it was you who sent me.",
      "John 17:20-21"
    ),
    date: MAY_9_2026,
    firstReading: proper(
      MAY_9_2026,
      "first_reading",
      "First Reading",
      "Paul reached also Derbe and Lystra\nwhere there was a disciple named Timothy.\nThe brothers in Lystra and Iconium spoke highly of him,\nand Paul wanted him to come along with him.\nThey traveled through the cities,\nhanding on the decisions reached by the Apostles and presbyters in Jerusalem.\nDay after day the churches grew stronger in faith and increased in number.",
      "Acts 16:1-5"
    ),
    gospel: proper(
      MAY_9_2026,
      "gospel",
      "Gospel",
      "Jesus said to his disciples:\nIf the world hates you,\nrealize that it hated me first.\nIf you belonged to the world,\nthe world would love its own;\nbut because you do not belong to the world,\nand I have chosen you out of the world,\nthe world hates you.\nRemember the word I spoke to you:\nNo slave is greater than his master.",
      "John 15:18-21"
    ),
    gospelAcclamationVerse: proper(
      MAY_9_2026,
      "gospel_acclamation_verse",
      "Gospel Acclamation Verse",
      "If then you were raised with Christ,\nseek what is above,\nwhere Christ is seated at the right hand of God.",
      "Colossians 3:1"
    ),
    prayerAfterCommunion: proper(
      MAY_9_2026,
      "prayer_after_communion",
      "Prayer after Communion",
      "May the mysteries we have received,\nO Lord, we pray,\nenlighten us by the instruction they bring\nand restore us through our participation in them,\nthat we may merit the gifts of the Spirit.",
      REVIEW_SOURCE
    ),
    prayerOverOfferings: proper(
      MAY_9_2026,
      "prayer_over_offerings",
      "Prayer over the Offerings",
      "Accept in compassion, Lord, we pray,\nthe offerings of your family,\nthat under your protective care\nthey may never lose what they have received,\nbut attain the gifts that are eternal.",
      REVIEW_SOURCE
    ),
    psalmResponse: proper(MAY_9_2026, "psalm_response", "Responsorial Psalm", "Let all the earth cry out to God with joy.", "Psalm 100"),
    psalmVerses: proper(
      MAY_9_2026,
      "psalm_verses",
      "Psalm Verses",
      "Sing joyfully to the Lord, all you lands;\nserve the Lord with gladness;\ncome before him with joyful song.\nKnow that the Lord is God;\nhe made us, his we are;\nhis people, the flock he tends.",
      "Psalm 100:1-3"
    ),
    secondReading: unavailableProper
  },
  [MAY_10_2026]: {
    collect: proper(
      MAY_10_2026,
      "collect",
      "Collect",
      "Grant, almighty God,\nthat we may celebrate with heartfelt devotion these days of joy,\nwhich we keep in honor of the risen Lord,\nand that what we relive in remembrance\nwe may always hold to in what we do.",
      REVIEW_SOURCE
    ),
    communionAntiphon: proper(
      MAY_10_2026,
      "communion_antiphon",
      "Communion Antiphon",
      "If you love me, keep my commandments, says the Lord,\nand I will ask the Father and he will send you another Paraclete,\nto abide with you for ever.",
      "John 14:15-16"
    ),
    date: MAY_10_2026,
    firstReading: proper(
      MAY_10_2026,
      "first_reading",
      "First Reading",
      "Philip went down to the city of Samaria\nand proclaimed the Christ to them.\nWith one accord, the crowds paid attention to what was said by Philip\nwhen they heard it and saw the signs he was doing.\nThere was great joy in that city.",
      "Acts 8:5-8, 14-17"
    ),
    gospel: proper(
      MAY_10_2026,
      "gospel",
      "Gospel",
      "Jesus said to his disciples:\nIf you love me, you will keep my commandments.\nAnd I will ask the Father,\nand he will give you another Advocate to be with you always.\nWhoever loves me will be loved by my Father,\nand I will love him and reveal myself to him.",
      "John 14:15-21"
    ),
    gospelAcclamationVerse: proper(
      MAY_10_2026,
      "gospel_acclamation_verse",
      "Gospel Acclamation Verse",
      "Whoever loves me will keep my word, says the Lord,\nand my Father will love him and we will come to him.",
      "John 14:23"
    ),
    prayerAfterCommunion: proper(
      MAY_10_2026,
      "prayer_after_communion",
      "Prayer after Communion",
      "Almighty ever-living God,\nwho restore us to eternal life in the Resurrection of Christ,\nincrease in us, we pray, the fruits of this paschal Sacrament\nand pour into our hearts the strength of this saving food.",
      REVIEW_SOURCE
    ),
    prayerOverOfferings: proper(
      MAY_10_2026,
      "prayer_over_offerings",
      "Prayer over the Offerings",
      "May our prayers rise up to you, O Lord,\ntogether with the sacrificial offerings,\nso that, purified by your graciousness,\nwe may be conformed to the mysteries of your mighty love.",
      REVIEW_SOURCE
    ),
    psalmResponse: proper(MAY_10_2026, "psalm_response", "Responsorial Psalm", "Let all the earth cry out to God with joy.", "Psalm 66"),
    psalmVerses: proper(
      MAY_10_2026,
      "psalm_verses",
      "Psalm Verses",
      "Shout joyfully to God, all the earth;\nsing praise to the glory of his name;\nproclaim his glorious praise.\nLet all on earth worship and sing praise to you,\nsing praise to your name.",
      "Psalm 66:1-7, 16, 20"
    ),
    secondReading: proper(
      MAY_10_2026,
      "second_reading",
      "Second Reading",
      "Beloved:\nSanctify Christ as Lord in your hearts.\nAlways be ready to give an explanation\nto anyone who asks you for a reason for your hope,\nbut do it with gentleness and reverence,\nkeeping your conscience clear.",
      "1 Peter 3:15-18"
    )
  },
  [MAY_11_2026]: {
    collect: proper(
      MAY_11_2026,
      "collect",
      "Collect",
      "Grant, O merciful God,\nthat we may experience at all times\nthe fruit produced by the paschal observances,\nthrough the renewal you bring to your people.",
      REVIEW_SOURCE
    ),
    communionAntiphon: proper(
      MAY_11_2026,
      "communion_antiphon",
      "Communion Antiphon",
      "The Lord is risen and has shone his light upon us,\nwhom he has redeemed by his Blood.",
      REVIEW_SOURCE
    ),
    date: MAY_11_2026,
    firstReading: proper(
      MAY_11_2026,
      "first_reading",
      "First Reading",
      "We set sail from Troas,\nmaking a straight run for Samothrace,\nand on the next day to Neapolis,\nand from there to Philippi.\nOn the sabbath we went outside the city gate along the river\nwhere we thought there would be a place of prayer.",
      "Acts 16:11-15"
    ),
    gospel: proper(
      MAY_11_2026,
      "gospel",
      "Gospel",
      "Jesus said to his disciples:\nWhen the Advocate comes whom I will send you from the Father,\nthe Spirit of truth who proceeds from the Father,\nhe will testify to me.\nAnd you also testify,\nbecause you have been with me from the beginning.",
      "John 15:26-16:4a"
    ),
    gospelAcclamationVerse: proper(
      MAY_11_2026,
      "gospel_acclamation_verse",
      "Gospel Acclamation Verse",
      "The Spirit of truth will testify to me, says the Lord,\nand you also will testify.",
      "John 15:26b, 27a"
    ),
    prayerAfterCommunion: proper(
      MAY_11_2026,
      "prayer_after_communion",
      "Prayer after Communion",
      "Look with kindness upon your people, O Lord,\nand grant, we pray,\nthat those you were pleased to renew by eternal mysteries\nmay attain in their flesh the incorruptible glory of the resurrection.",
      REVIEW_SOURCE
    ),
    prayerOverOfferings: proper(
      MAY_11_2026,
      "prayer_over_offerings",
      "Prayer over the Offerings",
      "Receive, O Lord, we pray,\nthese offerings of your exultant Church,\nand, as you have given her cause for such great gladness,\ngrant also that the gifts we bring may bear fruit in perpetual happiness.",
      REVIEW_SOURCE
    ),
    psalmResponse: proper(MAY_11_2026, "psalm_response", "Responsorial Psalm", "The Lord takes delight in his people.", "Psalm 149"),
    psalmVerses: proper(
      MAY_11_2026,
      "psalm_verses",
      "Psalm Verses",
      "Sing to the Lord a new song\nof praise in the assembly of the faithful.\nLet Israel be glad in their maker;\nlet the children of Zion rejoice in their king.",
      "Psalm 149:1b-6a, 9b"
    ),
    secondReading: unavailableProper
  },
  [NOVEMBER_1_2026]: {
    collect: proper(
      NOVEMBER_1_2026,
      "collect",
      "Collect",
      "Almighty ever-living God,\nby whose gift we venerate in one celebration\nthe merits of all the Saints,\nbestow on us, we pray,\nthrough the prayers of so many intercessors,\nan abundance of the reconciliation with you for which we earnestly long.",
      REVIEW_SOURCE
    ),
    communionAntiphon: proper(
      NOVEMBER_1_2026,
      "communion_antiphon",
      "Communion Antiphon",
      "Blessed are the clean of heart, for they shall see God.\nBlessed are the peacemakers, for they shall be called children of God.\nBlessed are they who are persecuted for the sake of righteousness,\nfor theirs is the Kingdom of Heaven.",
      "Matthew 5:8-10"
    ),
    date: NOVEMBER_1_2026,
    firstReading: proper(
      NOVEMBER_1_2026,
      "first_reading",
      "First Reading",
      "I, John, saw another angel come up from the East,\nholding the seal of the living God.\nAfter this I had a vision of a great multitude,\nwhich no one could count,\nfrom every nation, race, people, and tongue.\nThey stood before the throne and before the Lamb,\nwearing white robes and holding palm branches in their hands.",
      "Revelation 7:2-4, 9-14"
    ),
    gospel: proper(
      NOVEMBER_1_2026,
      "gospel",
      "Gospel",
      "When Jesus saw the crowds,\nhe went up the mountain,\nand after he had sat down, his disciples came to him.\nHe began to teach them, saying:\nBlessed are the poor in spirit,\nfor theirs is the Kingdom of heaven.",
      "Matthew 5:1-12a"
    ),
    gospelAcclamationVerse: proper(
      NOVEMBER_1_2026,
      "gospel_acclamation_verse",
      "Gospel Acclamation Verse",
      "Come to me, all you who labor and are burdened,\nand I will give you rest, says the Lord.",
      "Matthew 11:28"
    ),
    prayerAfterCommunion: proper(
      NOVEMBER_1_2026,
      "prayer_after_communion",
      "Prayer after Communion",
      "As we adore you, O God,\nwho alone are holy and wonderful in all your Saints,\nwe implore your grace,\nso that, coming to perfect holiness in the fullness of your love,\nwe may pass from this pilgrim table to the banquet of our heavenly homeland.",
      REVIEW_SOURCE
    ),
    prayerOverOfferings: proper(
      NOVEMBER_1_2026,
      "prayer_over_offerings",
      "Prayer over the Offerings",
      "May these offerings we bring in honor of all the Saints\nbe pleasing to you, O Lord,\nand grant that, just as we believe the Saints to be already assured of immortality,\nso we may experience their concern for our salvation.",
      REVIEW_SOURCE
    ),
    psalmResponse: proper(NOVEMBER_1_2026, "psalm_response", "Responsorial Psalm", "Lord, this is the people that longs to see your face.", "Psalm 24"),
    psalmVerses: proper(
      NOVEMBER_1_2026,
      "psalm_verses",
      "Psalm Verses",
      "The Lord's are the earth and its fullness;\nthe world and those who dwell in it.\nWho can ascend the mountain of the Lord?\nHe whose hands are sinless, whose heart is clean.",
      "Psalm 24:1bc-6"
    ),
    secondReading: proper(
      NOVEMBER_1_2026,
      "second_reading",
      "Second Reading",
      "Beloved:\nSee what love the Father has bestowed on us\nthat we may be called the children of God.\nBeloved, we are God's children now;\nwhat we shall be has not yet been revealed.",
      "1 John 3:1-3"
    )
  }
};

export function getReviewMassContentDates() {
  return Object.keys(REVIEW_MASS_CONTENT).sort();
}
