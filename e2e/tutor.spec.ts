import { test, expect } from '@playwright/test';

test.describe('Tutor', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://test/api/v1/tutor/**', async (route) => {
      if (route.request().url().includes('syllabus')) {
        const json = {
          syllabus: [
            {
              content:
                '### Syllabus: French Investments and International Financial Statistics\n\n---\n\n#### **1. Course Description**  \nThis course examines the complexities in international financial statistics with a focus on discrepancies in data regarding French investments in foreign securities, particularly American debt instruments. Through the lens of contrasting methodologies employed by the U.S. Treasury and Banque de France, students will explore how financial data measurement impacts economic analysis. The course will address both theoretical and methodological aspects of financial data discrepancies, ultimately providing insights into investment patterns, international financial systems, and methodological rigor in data collection and interpretation.\n\n---\n\n#### **2. Learning Objectives**  \n- Introduce students to the methodologies involved in measuring international financial statistics.  \n- Explore patterns of French investments in foreign debt securities and their broader economic implications.  \n- Examine the discrepancies in financial data arising from differing institutional methodologies.  \n- Provide an overview of data interpretation within the context of global financial markets.\n\n---\n\n#### **3. Learning Outcomes**  \nBy the end of the course, students will be able to:  \n1. Analyze and explain discrepancies in international financial data between institutions.  \n2. Critically assess the methodologies used in financial statistics by the U.S. Treasury and the Banque de France.  \n3. Evaluate the impact of investment data discrepancies on economic policies and international relations.  \n4. Synthesize insights into patterns of French investment in foreign securities and their global economic implications.  \n5. Develop proficiency in interpreting and comparing financial datasets.  \n\n---\n\n#### **4. Competencies Developed**  \n- **Critical Thinking**: Ability to evaluate and compare statistical methodologies and their implications.  \n- **Data Analysis**: Skills in analyzing and interpreting financial data discrepancies.  \n- **Global Economic Awareness**: Understanding of international investment flows and their economic effects.  \n- **Research Proficiency**: Competence in working with complex data sets from diverse institutional sources.  \n- **Effective Communication**: Articulating findings on financial discrepancies to varied audiences, including academic and policy-focused stakeholders.\n\n---\n\n#### **5. Assessment Methods**  \n1. **Written Assignments (30%)**  \n   - Comparative analysis of U.S. Treasury and Banque de France methodologies.  \n\n2. **Midterm Exam (25%)**  \n   - Covers key concepts, patterns of French investments, and global financial data systems.  \n\n3. **Group Project (25%)**  \n   - Collaborative research and presentation on a case study of data discrepancies in international investment statistics.  \n\n4. **Final Exam (20%)**  \n   - Cumulative assessment of theoretical and methodological concepts discussed in the course.  \n\n---\n\n#### **6. Course Schedule**  \n\n| **Week** | **Topic**                                              | **Learning Outcomes Targeted**                    |\n|---------|--------------------------------------------------------|--------------------------------------------------|\n| Week 1  | Introduction to International Financial Statistics      | LO1, LO4                                         |\n| Week 2  | French Investment Patterns: An Overview                 | LO2, LO4                                         |\n| Week 3  | U.S. Treasury Methodology: Strengths and Limitations    | LO2                                              |\n| Week 4  | Banque de France Methodology: Comparative Insights      | LO2, LO3                                         |\n| Week 5  | Case Studies in Data Discrepancy: French Investments    | LO1, LO3, LO5                                    |\n| Week 6  | Midterm Exam and Methodological Debates                 | LO1, LO2                                         |\n| Week 7  | Data Interpretation in International Relations          | LO3, LO5                                         |\n| Week 8  | Economic Implications of Data Discrepancies             | LO3, LO4, LO5                                    |\n| Week 9  | Presenting Financial Data: Effective Communication      | LO5                                              |\n| Week 10 | Group Project Presentations and Course Wrap-Up          | LO1, LO3, LO5                                    |\n\n---\n\n#### **7. References**  \n- Banque de France reports on investment patterns and financial data collection.  \n- Reports and datasets from the U.S. Treasury on international investments.  \n- Relevant journal articles on international financial data measurement methodologies.  \n- Case studies on statistical discrepancies in global financial markets.  \n\n--- \n\nThis structured syllabus provides a comprehensive framework for understanding the fundamental themes, skills, and methodologies related to French investments and international financial statistics.',
              source: 'UniversityTeacherAgent'
            },
            {
              content:
                '### Revised Syllabus: French Investments and International Financial Statistics with Integrated Sustainability Concepts\n\n---\n\n#### **1. Course Description**  \nThis course examines the complexities in international financial statistics with a focus on discrepancies in data regarding French investments in foreign securities, particularly American debt instruments. Through the lens of contrasting methodologies employed by the U.S. Treasury and Banque de France, students will explore how financial data measurement impacts economic analysis. Additionally, the course integrates sustainability principles by examining the implications of financial statistics on equitable economic systems, sustainable global policy frameworks, and long-term risks associated with unsustainable investment processes. By connecting financial methodologies to broader sustainability concerns, students will develop an interdisciplinary perspective on international investments and their role in shaping a sustainable global economy.\n\n---\n\n#### **2. Learning Objectives**  \n- Introduce students to the methodologies involved in measuring international financial statistics.  \n- Explore patterns of French investments in foreign debt securities and their broader economic implications.  \n- Examine the discrepancies in financial data arising from differing institutional methodologies.  \n- Provide an overview of data interpretation within the context of global financial markets.  \n- Highlight the intersection of financial statistics and sustainability, exploring how investment patterns can support or hinder the Sustainable Development Goals (SDGs), especially Goals 8, 16, and 17.  \n\n---\n\n#### **3. Learning Outcomes**  \nBy the end of the course, students will be able to:  \n1. Analyze and explain discrepancies in international financial data between institutions.  \n2. Critically assess the methodologies used in financial statistics by the U.S. Treasury and the Banque de France.  \n3. Evaluate the impact of investment data discrepancies on economic policies, international relations, and long-term sustainability outcomes.  \n4. Synthesize insights into patterns of French investment in foreign securities, considering their implications for global economic equity and ecological sustainability.  \n5. Develop proficiency in interpreting and comparing financial datasets and identifying opportunities for enhancing sustainable financial practices.  \n6. Integrate sustainability frameworks, such as the SDGs and GreenComp competencies, to critically assess financial systems and their social, economic, and environmental impacts.  \n\n---\n\n#### **4. Competencies Developed**  \n- **Critical Thinking**: Ability to evaluate and compare statistical methodologies and their implications for sustainable economic systems.  \n- **Data Analysis**: Skills in analyzing and interpreting financial data discrepancies through the lens of sustainability and equity.  \n- **Global Economic Awareness**: Understanding of international investment flows, their sustainability challenges, and their implications for economic justice and ecological health.  \n- **Systems Thinking**: Application of interdisciplinary approaches to identify connections between financial methodologies and sustainability outcomes.  \n- **Futures Literacy**: Envisioning sustainable financial systems and strategies to eliminate long-term risks associated with unsustainable economic practices.  \n- **Effective Communication**: Articulating findings on financial discrepancies and their sustainability implications to varied audiences, including academic, policy-focused, and industry stakeholders.  \n- **Political Agency**: Navigating and advocating for sustainable investment policies that enhance accountability and transparency in financial systems.  \n\n---\n\n#### **5. Assessment Methods**  \n1. **Written Assignments (30%)**  \n   - Comparative analysis of U.S. Treasury and Banque de France methodologies, integrating a reflection on their alignment with Sustainable Development Goals.  \n\n2. **Midterm Exam (25%)**  \n   - Covers key concepts, patterns of French investments, global financial systems, and their impacts on sustainability.  \n\n3. **Group Project (25%)**  \n   - Collaborative research and presentation on a case study of data discrepancies in international investment statistics, evaluating their sustainability implications and proposing solutions aligned with SDGs.  \n\n4. **Final Exam (20%)**  \n   - Cumulative assessment of theoretical, methodological, and sustainability concepts discussed in the course.  \n\n---\n\n#### **6. Course Schedule**  \n\n| **Week** | **Topic**                                                      | **Learning Outcomes Targeted**                |\n|---------|----------------------------------------------------------------|----------------------------------------------|\n| Week 1  | Introduction to International Financial Statistics              | LO1, LO4, LO6                               |\n| Week 2  | French Investment Patterns: An Overview                         | LO2, LO4, LO6                               |\n| Week 3  | U.S. Treasury Methodology: Strengths and Limitations            | LO2, LO6                                    |\n| Week 4  | Banque de France Methodology: Comparative Insights              | LO2, LO3, LO6                               |\n| Week 5  | Case Studies in Data Discrepancy: French Investments            | LO1, LO3, LO5, LO6                          |\n| Week 6  | Midterm Exam and Methodological Debates                         | LO1, LO2, LO6                               |\n| Week 7  | Financial Data and Sustainability: Interfacing with the SDGs    | LO3, LO4, LO6                               |\n| Week 8  | Economic Implications of Data Discrepancies                     | LO3, LO4, LO5, LO6                          |\n| Week 9  | Presenting Financial Data for Sustainable Policy Advocacy       | LO5, LO6                                    |\n| Week 10 | Group Project Presentations and Course Wrap-Up                  | LO1, LO3, LO5, LO6                          |\n\n---\n\n#### **7. References**  \n- Banque de France reports on investment patterns and financial data collection.  \n- Reports and datasets from the U.S. Treasury on international investments.  \n- Relevant journal articles on international financial data measurement methodologies.  \n- Case studies on statistical discrepancies in global financial markets.  \n- United Nations SDGs documentation, particularly Goals 8 (Decent Work and Economic Growth), 16 (Peace, Justice, and Strong Institutions), and 17 (Partnerships for the Goals).  \n- GreenComp: The European Sustainability Competence Framework.  \n\n---\n\nThis revised syllabus provides a robust interdisciplinary framework connecting financial statistics to sustainability principles, equipping students with analytical skills, critical thinking, and advocacy tools for fostering transparent and equitable global economic practices.',
              source: 'SDGExpertAgent'
            },
            {
              content:
                '### Final Syllabus: French Investments and International Financial Statistics with Integrated Sustainability Concepts\n\n---\n\n#### **1. Course Description**  \nThis course examines the complexities of international financial statistics, focusing on discrepancies in data regarding French investments in foreign securities, particularly American debt instruments. It explores contrasting methodologies employed by the U.S. Treasury and Banque de France, emphasizing how financial data measurement impacts economic analysis and policy-making. Through the integration of sustainability principles, students will evaluate implications of financial statistics on equitable economic systems, sustainable global policy frameworks, and the long-term risks associated with unsustainable investment processes. By connecting financial methodologies to broader sustainability concerns, the course equips students to analyze international investments from an interdisciplinary and systems-thinking perspective, fostering solutions that align with global sustainability goals.\n\n---\n\n#### **2. Learning Objectives**  \n- Introduce students to the methodologies involved in measuring international financial statistics.  \n- Explore patterns of French investments in foreign debt securities and their broader economic implications.  \n- Examine data discrepancies in financial statistics arising from differing institutional methodologies and their impact on global analysis.  \n- Provide an overview of global financial markets and implications of data interpretation for sustainability practices.  \n- Highlight the intersection of financial statistics and sustainability, with emphasis on how investment patterns can support or hinder the Sustainable Development Goals (SDGs), particularly Goals 8, 16, and 17.  \n\n---\n\n#### **3. Learning Outcomes**  \nBy the end of the course, students will be able to:  \n**LO1:** Analyze and explain discrepancies in international financial data between institutions through active comparative exercises, case studies, and class debates.  \n**LO2:** Critically assess the methodologies used in financial statistics by the U.S. Treasury and the Banque de France, leveraging small group collaborations and targeted assignments.  \n**LO3:** Evaluate the impact of investment data discrepancies on economic policies, international relations, and long-term sustainability outcomes using problem-solving frameworks and systems-thinking applications.  \n**LO4:** Synthesize insights into patterns of French investment in foreign securities, considering their implications for global economic equity and ecological sustainability, by designing data visualizations and engaging in interdisciplinary exploratory activities.  \n**LO5:** Develop proficiency in interpreting and comparing financial datasets and identifying opportunities for enhancing sustainable financial practices through guided explore activities and futures literacy exercises.  \n**LO6:** Integrate sustainability frameworks, including the SDGs and GreenComp competencies, to critically assess financial systems and their social, economic, and environmental impacts, using creative group presentations and policy advocacy simulations.  \n\n---\n\n#### **4. Competencies Developed**  \n- **Critical Thinking (2.2)**: Assess and compare statistical methodologies and implications for sustainable economic systems.  \n- **Problem Framing (2.3)**: Formulate challenges arising from financial discrepancies as sustainability problems to address long-term solutions.  \n- **Systems Thinking (2.1)**: Identify interactions within and between financial and sustainability systems.  \n- **Futures Literacy (3.1)**: Envision sustainable futures in financial practices and develop pathways for policy change.  \n- **Exploratory Thinking (3.3)**: Apply interdisciplinary approaches to sustainable financial analysis through creativity and collaboration.  \n- **Political Agency (4.1)**: Advocate for sustainable investment policies and demand accountability in global financial systems.  \n- **Collective Action (4.2)**: Collaborate effectively in teams to address fiscal sustainability challenges.  \n- **Valuing Sustainability (1.1)**: Reflect on how investment data emphasizes sustainability values, equity, and fairness.  \n- **Supporting Fairness (1.2)**: Advocate for transparency and justice in financial data practices for current and future generations.\n\n---\n\n#### **5. Assessment Methods**  \n1. **Written Assignments (30%)**  \n   - Comparative analysis of U.S. Treasury and Banque de France methodologies, integrating reflections on SDGs and GreenComp relevance.  \n\n2. **Midterm Exam (25%)**  \n   - Covers key financial methodologies, patterns of French investments, and impacts in sustainability contexts.  \n\n3. **Group Project (25%)**  \n   - Collaborative research on case studies of financial data discrepancies, sustainability implications, and proposed solutions connected to SDGs and GreenComp competencies.  \n\n4. **Final Exam (20%)**  \n   - Cumulative assessment of theories, methodologies, and sustainability concepts explored throughout the course.  \n\n---\n\n#### **6. Course Schedule**  \n\n| **Week** | **Topic**                                                      | **Learning Outcomes Targeted** | **Class Plan**                                                                                                                          |\n|---------|----------------------------------------------------------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|\n| Week 1  | Introduction to International Financial Statistics              | LO1, LO4, LO6                  | Introductory lecture; group activity for identifying real-world implications of financial statistics; brainstorming SDG applications.  |\n| Week 2  | French Investment Patterns: An Overview                         | LO2, LO4, LO6                  | Data-led seminar; group discussion on historical French investment trends; systems mapping exercise for global equity perspectives.   |\n| Week 3  | U.S. Treasury Methodology: Strengths and Limitations            | LO2, LO6                       | Presentation; critical assessment exercise comparing U.S. Treasury reporting with Banque de France data. Structured debate activity. |\n| Week 4  | Banque de France Methodology: Comparative Insights              | LO2, LO3, LO6                  | Workshop: Comparative data evaluation; paired assignments to demonstrate methodology discrepancies and sustainability implications.  |\n| Week 5  | Case Studies in Data Discrepancy: French Investments            | LO1, LO3, LO5, LO6             | Case study collaborative analysis; students redesign data interpretation methods to propose sustainable solutions.                     |\n| Week 6  | Midterm Exam and Methodological Debates                         | LO1, LO2, LO6                  | Class-run policy debate simulation; midterm exam covering material from Weeks 1–5.                                                   |\n| Week 7  | Financial Data and Sustainability: Interfacing with the SDGs    | LO3, LO4, LO6                  | Lecture; group inquiry into SDG alignments; exploratory thinking workshop for alternative economic solutions using financial data.     |\n| Week 8  | Economic Implications of Data Discrepancies                     | LO3, LO4, LO5, LO6             | Workshop analyzing economic effects of incorrect financial data; futures literacy activity focused on long-term sustainable frameworks. |\n| Week 9  | Presenting Financial Data for Sustainable Policy Advocacy       | LO5, LO6                       | Research seminar on advocacy strategies; collaborative presentations of financial sustainability models based on realistic datasets.   |\n| Week 10 | Group Project Presentations and Course Wrap-Up                  | LO1, LO3, LO5, LO6             | Student-led presentations; peer feedback; final synthesis workshop connecting lessons learned to GreenComp competencies and SDGs.      |\n\n---\n\n#### **7. References**  \n- Banque de France reports on investment patterns and financial data collection.  \n- Reports and datasets from the U.S. Treasury on international investments.  \n- Journal articles reviewing methodologies in international financial data measurement.  \n- Case studies highlighting statistical discrepancies in global financial markets.  \n- United Nations SDGs documentation, particularly Goals 8 (Decent Work and Economic Growth), 16 (Peace, Justice, and Strong Institutions), and 17 (Partnerships for the Goals).  \n- **GreenComp: The European Sustainability Competence Framework**.  \n\n---\n\nThis revised syllabus ensures optimal pedagogical effectiveness by integrating active learning strategies and aligning learning objectives, outcomes, and competencies with course activities. It adheres to GreenComp competencies while fostering practical applications in sustainability-oriented financial analysis.',
              source: 'PedagogicalEngineerAgent'
            }
          ],
          documents: []
        };
        await route.fulfill({ json });
      } else if (route.request().url().includes('search')) {
        const json = {
          extracts: [
            {
              original_document:
                'Banque de France – Bloc-Notes Eco 401 – 04 avril 2025 Les Français ont-ils massivement investi en obligations américaines ? Par Fabrice Bidaud',
              summary:
                'The document examines the discrepancies in statistics regarding French investments in American debt securities, comparing data from the U.S. Treasury and Banque de France. It concludes that data from Banque de France is more accurate due to limitations in the U.S. Treasury methodology on ultimate holder identification.',
              themes: [
                'Discrepancies in international financial statistics',
                'French investment patterns in foreign securities',
                'Methodologies of financial data measurement'
              ]
            }
          ],
          nb_results: 3,
          documents: [
            {
              id: '41159d39-aa07-4ae1-b3fc-6ffd5df34259',
              version: 554,
              score: 0.5202923,
              payload: {
                document_corpus: 'openalex',
                slice_content:
                  'This was what had occurred when Mexican president Benito Juárez repudiated the bonded loans issued by Emperor Maximilian on the French markets in 1867, and France indemnified its nationals who had purchased the securities to the extent of the half of the amount invested. The decision of the French government was justified by the support in establishing and financing Maximilian of Habsburg as Emperor of Mexico. See WILLIAM H. W YNNE ,STATE INSOLVENCY AND FOREIGN BONDHOLDERS :SELECTED CASE HISTORIES OF GOVERNMENTAL FOREIGN BOND DEFAULTS AND DEBT READJUSTMENTS 27 – 30 (1951). 69The lump sum was constituted by gold that had been deposited by the Czar in the Barings Bank and frozen following the October Revolution. See Agreement Between the Government of the United Kingdom of Great Britain and Northern Ireland and the Government of the Union of Soviet Socialist Republics Concerning the Settlement of Mutual Financial and PropertyClaims, U.K.-U.S.S.R., art. 2(b), July 15, 1986, 9130 U.N.T.S. 638. S ee also Szurek, supra note 62, at 49. 70Holders could be compensated in two ways: Either by limiting compensation to the original holders and their heirs as victims of the Bolshevist repudiation, or by recognizing compensation indifferently to all the current holders of the bonds; thelatter route was taken.\n\nSee Anne Muxart, Le système de mise en oeuvre législative et réglementaire du mémorandum d ’ accord franco-russe du 26 novembre 1996 relatif à l ’ indemnisation de Français spoliés ou dépossédes par l ’ -URSS , in L ESEMPRUNTS RUSSES ET LE RÈGLEMENT DU CONTENTIEUX FINANCIER FRANCO -RUSSE, 197, 229 – 41 (Patrick Julliard & Brigitte Stern eds., 2002). 71 See Sandra Szurek, Épilogue d ’ un contentiueux historique, in 44 A NNUAIRE FRANÇAIS DE DROIT INTERNATIONAL , 143, 154 (1998).780 Mauro Megliani in conformity with international law ” contained in Article 33 could 72Nevertheless, its significance would 73 74On the other hand, most of the scholars do not believe specifically under Articles 37, 40, and 41 — the general rule 76In all these cases, the state debt 77In this context, it is worth emphasizing that the Vienna Convention does not 78The equitable distribution of assets and liabilities combines the necessity rights with the self-determination of debtor states.79 In terms of practice, at least three situations can be identified under which some equitable the Czech Republic and Slovakia — agreed to divide the assets and liabilities See REXJ. ZEDALIS ,CLAIMS AGAINST IRAQI OIL AND GAS:LEGAL CONSIDERATIONS AND LESSONS LEARNED 42 – 43 (2010). – 61 (2016). See Andrew Yianni & David Tinkler, Is There a Recognized Legal Doctrine of Odious Debts , 32 N.C. J. I NT ’ LL. 749, 766 – 67 See Christoph G. Paulus, “ Odious Debts ” vs. Debt Trap: A Realistic Help? ,',
                document_details: {
                  authors: [
                    {
                      misc: 'Catholic University, Milan, Italy',
                      name: 'Mauro Angelo Megliani'
                    }
                  ],
                  duration: 3318,
                  publisher: 'Cambridge University Press',
                  readability: 55.29
                },
                document_url: 'https://openalex.org/W4398140033',
                document_sdg: [16],
                document_desc:
                  'The odious debt doctrine was envisaged by the Russian jurist Alexander Sack as an exception to the passing rule of a debt in case of state and government succession. An analysis of the practice indicates that this exception was often accompanied by some equitable solution. Although the 1983 Vienna Convention did not acknowledge the doctrine, the equitable distribution of assets and liabilities as a method of settling disputes may allow an application of the doctrine in disguise. This equitable method of settling could come into play if the doctrine found application beyond the strict boundaries of state succession. Such a step would imply the formalization of the doctrine in national legislation, with the result that a loan agreement tainted with odiousness would be illegal and unenforceable. Nevertheless, in common law countries, the laws of which usually govern financial transactions, a claim for recovering what transferred under an illegal contract could be denied based on public policy considerations. This denial of restitution would refrain these countries, traditionally sensitive to creditors’ rights, from acknowledging the doctrine in their legal systems. To overcome this impasse, the formalization of the doctrine should include an equitable approach based on the benefit for the population. This equitable approach would reflect the practice of state and government succession on which the doctrine is usually grounded.',
                document_scrape_date: '2025-02-28T16:45:47.150401',
                document_lang: 'en',
                document_id: '2cf4bf5b-2ff5-4237-a33c-c90679aa6533',
                document_title: 'The Odious Debt Doctrine: The Equitable Rule',
                slice_sdg: 16
              },
              vector: [
                -0.06770411, 0.047651745, -0.04074862, 0.0031462414, -0.042549744, -0.05646214
              ],
              shard_key: null,
              order_value: null
            },
            {
              id: 'ace50abe-b10a-4946-b920-af3509f0f22d',
              version: 67,
              score: 0.5145931,
              payload: {
                document_corpus: 'hal',
                document_desc:
                  'This paper is the first result of a project aiming at understanding the history of bankruptcy law from an empirical economic perspective...',
                document_details: {
                  authors: [
                    {
                      misc: '',
                      name: 'Pierre-Cyrille Hautcoeur'
                    },
                    {
                      misc: '',
                      name: 'Nadine Levratto'
                    }
                  ]
                },
                document_id: '6cc6589b-3d21-4657-b1b3-0ebc1e2b2693',
                document_lang: 'en',
                document_scrape_date: '2023-11-27T13:10:27.395496',
                document_sdg: [16],
                document_title:
                  'Does the law alone explain the rise in bankruptcies in XIXth century France?',
                document_url: 'https://shs.hal.science/halshs-00589125',
                slice_content:
                  "We use a new and still incomplete database constructed using both the yearly official statistics produced by the judicial system from 1830 on, and individual bankruptcy files from the Paris commercial court (Tribunal de commerce) archives in order to measure actual practices. The first part of the paper presents the evolution of French bankruptcy law during the XIXth century in its historical context. The second part briefly describes the theoretical model we use in order to understand the choices facing debtors and creditors in the face of financial distress. The last part proposes some major stylized facts concerning bankruptcies during that period and tries to understand their relationship with the legal evolution described before. Cet article est le premier produit d'un projet sur l'histoire des faillites en France analysée selon une perspective économique empirique. Par opposition au courant \"Law and economics\" (La Porta & alii, 1998), nous considérons que l'impact de la législation des faillites sur les performances économiques nationales ne peut être simplement déduite a priori d'une simple description de la législation, mais doit résulter d'un examen détaillé des pratiques judiciaires et du comportement des agents économiques. En outre, nous considérons qu'une analyse empirique des faillites doit commencer par comprendre les déterminants de la proportion de relations de crédit qui aboutit devant les tribunaux (par opposition à des règlements à l'amiable). La réponse à cette question simple est un préalable selon nous à toute utilisation pertinente des statistiques de faillites.",
                slice_sdg: 16
              },
              vector: [
                -0.05141739, 0.0010452664, -0.04556304, -0.07695358, -0.0013645433, 0.025308661
              ],
              shard_key: null,
              order_value: null
            },
            {
              id: 'dee45618-687c-4260-8935-27d18be1c427',
              version: 900,
              score: 0.5054817,
              payload: {
                document_id: '086fad42-0211-4199-a60e-067b6153b6fe',
                slice_sdg: 8,
                slice_content:
                  'Leading Indicators Our dataset consists of 51 leading indicators. The selection of leading indicators is based on the studies by Manasse et al. [ 34], Baldacci et al. [ 21], McHugh et al. [ 26], Berti et al. [ 22], and Hernandez de Cos et al. [ 23]. Table 3 presents definitions, sources, and descriptive statistics for the selected leading indicators used in the study. We consider five sets of indicators. The first set consists of public and real sector variables: GDP , inflation, unemployment, government expenditure/GDP , primary balance/GDP , cyclically adjusted balance/GDP , revenue/GDP , interest payments/revenue, interest payments/expenses, cash surplus/GDP , REER, savings/expenditures, tax revenue/GDP , and wages. The second category includes financial indicators that exert an influence on sovereign debt situations: bank capital/asset, nonperforming loans/total loans, banking sector leverage, M2/GDP , and banking crisis index. The study uses Laeven and Valencia’s [ 35,36] definition of a banking crisis. Our third set of indicators encompasses different debt ratios: external debt/export, ex- ternal debt/GDP , external debt government/GDP , external debt private/GDP , net debt/GDP , and household debt/GDP . Social indicators constitute our fourth set: health expendi- ture/GDP , public health expenditure/GDP , Gini coefficient, gross enrollment ratio, fertility rate, and age dependency ratio. Excessive increases in health expenditures, a deterioration in income distribution, a decline in education level and in fertility rate, and an increase in age dependency ratio are expected to increase the likelihood of a debt crisis. Finally, our fifth and last set includes governance indicators.',
                document_sdg: [8, 16],
                document_scrape_date: '2025-03-14T15:21:43.298721',
                document_desc:
                  'The study aims to empirically identify the determinants of the debt crisis that occurred within the framework of 15 core EU member countries (EU-15). Contrary to previous empirical studies that tend to use event-based crisis indicators, our study develops a continuous fiscal stress index to identify the debt crises in the EU-15 and employs three different estimation techniques, namely self-organizing map, multivariate logit and panel Markov regime switching models. Our estimation results show first that the study correctly identifies the time and the length of the debt crisis in each EU-15-member country. Empirical results then indicate, via three different models, that the debt crisis in the EU-15 is the consequence of deterioration of both financial and macroeconomic variables such as nonperforming loans over total loans, GDP growth, unemployment rates, primary balance over GDP, and cyclically adjusted balance over GDP. Furthermore, variables measuring governance quality, such as voice and accountability, regulatory quality, and government effectiveness, also play a significant role in the emergence and the duration of the debt crisis in the EU-15.',
                document_lang: 'en',
                document_title:
                  'Determinants of the European Sovereign Debt Crisis: Application of Logit, Panel Markov Regime Switching Model and Self Organizing Maps',
                document_corpus: 'openalex',
                document_url: 'https://openalex.org/W4383722896',
                document_details: {
                  authors: [
                    {
                      misc: 'CNRS, GREDEG, Bâtiment 2, Campus Azur du CNRS, Université Côte d’Azur, 250 rue Albert Einstein, CS 10269, F-06905 Sophia Antipolis Cedex, France',
                      name: 'Jean-Pierre Allégret'
                    },
                    {
                      name: 'Raif Cergibozan',
                      misc: 'Department of Economics, Kirklareli University, Kayali Kampüsü B-Blok, 39000 Kirklareli, Turkey'
                    }
                  ],
                  publisher: 'Multidisciplinary Digital Publishing Institute',
                  duration: 3425,
                  readability: 61.6
                }
              },
              vector: [
                0.038926113, -0.07946256, -0.044980563, 0.0023452565, 0.05506276, 0.04118246
              ],
              shard_key: null,
              order_value: null
            }
          ]
        };
        await route.fulfill({ json });
      } else {
        route.continue();
      }
    });
    await page.goto('/tutor');
    // close welcome modal
    await page.getByTestId('close').click();
  });

  test('should display input type file', async ({ page }) => {
    await expect(page.getByTestId('file-input')).toBeVisible();
  });

  test('should add more inputs files to the page', async ({ page }) => {
    await page.getByRole('button', { name: '+' }).click();
    const fileInputs = page.getByTestId('file-input');
    await expect(fileInputs).toHaveCount(2);
  });

  test('should remove input when clicking on x', async ({ page }) => {
    await page.getByRole('button', { name: '+' }).click();
    await expect(page.getByTestId('file-input')).toHaveCount(2);
    await page.getByRole('button', { name: 'x' }).last().click();
    await expect(page.getByTestId('file-input')).toHaveCount(1);
  });

  test('first del button should be disabled', async ({ page }) => {
    const delButton = page.getByRole('button', { name: 'x' });
    await expect(delButton.isDisabled()).toBeTruthy();
  });

  test('should add file to input', async ({ page }) => {
    const fileInput = page.getByTestId('file-input');
    await fileInput.click();
    await fileInput.setInputFiles('./e2e/files/test_tutor.pdf');
    await page.getByRole('button', { name: 'suivant' }).click();
    await expect(page.getByRole('heading', { name: 'Sélectionnez plus de sources' })).toBeVisible();

    await page.getByRole('button', { name: 'suivant' }).click();
    await expect(page.getByRole('heading', { name: 'Syllabus', exact: true })).toBeVisible();
  });
});
