---
创建时间: 2026-七月-2日  星期四, 7:46:16 晚上
---
Persuasion Planning Using Textual Entailment and Cluster-Augmented Search
1. Paper Summary 
This paper studies persuasion planning with LLM conversational agents. The authors propose CALM, a zero training, cluster augmented, open loop Monte Carlo Tree Search (MCTS) method. The approach performs search over action types, and within each search node, it applies sentence embedding clustering to both persuader utterances and target responses, thereby maintaining returns at the cluster level.
The paper also proposes using natural language inference (NLI) as a persuasion reward signal. In this formulation, the target's utterances are treated as premises and the goal stance is treated as the hypothesis; persuasion progress is measured by whether the target's expressed position entails the goal stance.
Experiments are conducted on three synthetic scenarios and two human derived dialogue benchmarks. The reported results show that CALM improves over several baselines on most NLI based evaluation metrics and often exhibits lower variance.

2. Summary of Strengths 
•	The proposed cluster augmented MCTS framework is conceptually clear and well motivated. By adding cluster level structure inside each action type node, the method provides a way to handle the high variance of LLM generated utterances.
•	The use of textual entailment as a persuasion reward is an interesting alternative to LLM as judge evaluation. It provides a continuous and reproducible signal for planning, and the paper includes a useful discussion of its relation to LLM critic based evaluation.
•	The empirical evaluation covers several settings, including synthetic persuasion scenarios and human derived dialogue benchmarks.

3. Summary of Weaknesses
•	The NLI metric is useful, but its connection to persuasion remains only partially validated. The paper gives a substantial discussion of entailment as a critic, and this discussion is helpful. However, the metric does not always correspond to actual persuasion, stable attitude change, or successful emotional support.
•	The evaluation is hard to interpret because different methods optimize different critics. As a result, strong performance on the corresponding optimized metric is partly expected. This issue is especially clear in ESConv, where the NLI metric and the LLM critic metric diverge sharply. 
•	The results on human derived benchmarks may be affected by a distribution shift after LLM target agents take over the dialogue. SR NLI and SR LLM are relatively close on the original human dialogues, but diverge sharply in generated continuations, especially in ESConv. This makes it difficult to tell whether the metric gap reflects evaluator behavior or differences between human target responses and LLM target responses.

4. Comments, Suggestions, and Typos 
•	In Appendix A.4, the phrase “we crafted a only short background persona for each agent” seems awkward. Do the authors mean “we crafted a short background persona for each agent”?
•	How sensitive is CALM to the manually defined action types? Since these action types define the search space, it is not clear whether the method would remain stable under alternative action type sets or different phrasings of the same tactics.
•	The clustering component is central to the proposed method, but I would like to better understand how this structure affects the results. The paper gives useful qualitative analysis and compares different cluster numbers, but it is still somewhat unclear whether the improvement mainly comes from persuader utterance clustering, target response clustering, or the general effect of maintaining finer grained statistics inside each action type node.
•	The role of the cluster level conditioning prompt could also be clarified, since it may partly contribute to the observed cluster stability.
•	In ESConv, the gap between SR NLI and SR LLM is very large. The paper argues that this reflects weaknesses of the LLM critic, but it could also indicate that the NLI formulation does not fully capture emotional support success. It would be helpful if the authors clarified what conclusions about method performance remain robust under this metric disagreement.
5. Ratings 

Confidence: _____4___    
Soundness: _____2.5___    
Excitement: ____2____    
Overall Assessment: ____2____   

6. Best Paper Justification 
NA

7. Limitations and Societal Impact 
•	The authors include a limitations section and acknowledge several important issues, including computational cost, the use of LLM simulated targets rather than direct human interaction, and the limitations of automated evaluation. This is useful and makes the scope of the work clearer.

8. Ethical Concerns 
None requiring a separate ethics review. The work has dual use potential because it improves persuasion planning for LLM conversational agents, but the authors acknowledge this risk.

Needs Ethics Review: No

9. scores 

Reproducibility: ____4____    
Datasets: ____2____    
Software: ____3____    

12. Reviewer Declarations 
Knowledge of or Educated Guess at Author Identity	No
Knowledge of Paper	NA
Knowledge of Paper Source	NA
Impact of Knowledge of Paper	NA

