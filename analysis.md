# Project_Suika_AI_goldbatne 웹 이식 분석

| 항목 | 값 |
|---|---|
| 분석 기준 경로 | `D:\00.new_unity\Project_Suika_AI_goldbatne-main\Project_Suika_AI_goldbatne-main` |
| 산출물 경로 | `D:\ai_subak_game_web\analysis.md` |
| 원본 출처 | `https://github.com/goldbatne/Project_Suika_AI_goldbatne` |
| Unity 버전 | `6000.3.19f1` |
| URP 버전 | `17.3.0` |
| Input System 버전 | `1.19.0` |
| 제외 폴더 | `Library`, `Temp`, `Build`, `obj`, `Logs` |
| 분석 원칙 | 실제 파일에서 확인한 값만 기재. 확인 실패/미존재 값은 `확인 안 됨` |

## 1-1. 과일 사다리

| 프리팹명 | level | Transform Scale | Rigidbody2D Mass | Collider Radius | 월드 반지름(Scale x Radius) | Tag | 연결된 다음 단계 프리팹 | Scale 증가율 |
|---|---:|---|---:|---:|---:|---|---|---:|
| `Fruit_01.prefab` | 0 | `{x: 0.28, y: 0.28, z: 1}` | 0.3 | 1 | 0.28 | `Fruit` | `Fruit_02.prefab` | 확인 안 됨 |
| `Fruit_02.prefab` | 1 | `{x: 0.327, y: 0.327, z: 1}` | 0.5 | 1 | 0.327 | `Fruit` | `Fruit_03.prefab` | 16.79% |
| `Fruit_03.prefab` | 2 | `{x: 0.382, y: 0.382, z: 1}` | 0.7 | 1 | 0.382 | `Fruit` | `Fruit_04.prefab` | 16.82% |
| `Fruit_04.prefab` | 3 | `{x: 0.447, y: 0.447, z: 1}` | 1 | 1 | 0.447 | `Fruit` | `Fruit_05.prefab` | 17.02% |
| `Fruit_05.prefab` | 4 | `{x: 0.522, y: 0.522, z: 1}` | 1.3 | 1 | 0.522 | `Fruit` | `Fruit_06.prefab` | 16.78% |
| `Fruit_06.prefab` | 5 | `{x: 0.61, y: 0.61, z: 1}` | 1.8 | 1 | 0.61 | `Fruit` | `Fruit_07.prefab` | 16.86% |
| `Fruit_07.prefab` | 6 | `{x: 0.713, y: 0.713, z: 1}` | 2.3 | 1 | 0.713 | `Fruit` | `Fruit_08.prefab` | 16.89% |
| `Fruit_08.prefab` | 7 | `{x: 0.834, y: 0.834, z: 1}` | 2.8 | 1 | 0.834 | `Fruit` | `Fruit_09.prefab` | 16.97% |
| `Fruit_09.prefab` | 8 | `{x: 0.975, y: 0.975, z: 1}` | 3.8 | 1 | 0.975 | `Fruit` | `Fruit_10.prefab` | 16.91% |
| `Fruit_10.prefab` | 9 | `{x: 1.139, y: 1.139, z: 1}` | 4.5 | 1 | 1.139 | `Fruit` | `Fruit_11.prefab` | 16.82% |
| `Fruit_11.prefab` | 10 | `{x: 1.331, y: 1.331, z: 1}` | 5.5 | 1 | 1.331 | `Fruit` | 없음 (`nextLevelPrefab: {fileID: 0}`) | 16.86% |

| 추가 확인 항목 | 값 |
|---|---|
| Collider 종류 | 모든 과일 `CircleCollider2D` |
| 과일 PhysicsMaterial2D | `Fruit_Mat.physicsMaterial2D` |
| `Fruit_Mat` | `friction: 0.2`, `bounciness: 0.4` |
| `Wall_Mat` | `friction: 0.1`, `bounciness: 0` |
| Tag 등록 | `ProjectSettings/TagManager.asset`에 `Fruit` 확인 |
| MergeEffect 연결 | 모든 `Fruit_01~11`에 `MergeEffect.prefab` 연결 |

## 1-2. 씬 구성

| 씬 | Build Settings 포함 | 역할 |
|---|---|---|
| `Assets/Scenes/TitleScene.unity` | enabled `1`, 순서 0 | 시작 화면. `MainTitle.ClickStart()`가 `GameScene` 로드 |
| `Assets/Scenes/GameScene.unity` | enabled `1`, 순서 1 | 실제 플레이 씬. 스폰/드롭/합체/점수/코인/흔들기/상점/데드존 담당 |
| `Assets/Settings/Scenes/URP2DSceneTemplate.unity` | 미포함 | URP 2D 템플릿 |
| `Assets/_Recovery/0*.unity` | 미포함 | 복구 씬 파일. 실제 역할 확인 안 됨 |

| GameScene 오브젝트 | Position | Scale | Collider 크기 | Trigger | Physics Material | 비고 |
|---|---|---|---|---:|---|---|
| `floor` | `{x: 0, y: -4, z: 0}` | `{x: 5, y: 0.2, z: 1}` | `BoxCollider2D {x: 3, y: 3}` | 0 | `Wall_Mat.physicsMaterial2D` | 월드 환산 약 `15 x 0.6` |
| `Wall_Left` | `{x: -2.4, y: -0.2, z: 0}` | `{x: 0.2, y: 7.5, z: 1}` | `BoxCollider2D {x: 1, y: 1}` | 0 | `Wall_Mat.physicsMaterial2D` | 좌측 벽 |
| `Wall_Right` | `{x: 2.4, y: -0.2, z: 0}` | `{x: 0.2, y: 7.5, z: 1}` | `BoxCollider2D {x: 1, y: 1}` | 0 | `Wall_Mat.physicsMaterial2D` | 우측 벽 |
| `Wall_Left_Ext` | `{x: -2.4, y: 13.5, z: 0}` | `{x: 0.2, y: 21, z: 1}` | `BoxCollider2D {x: 1, y: 1}` | 0 | 확인 안 됨 | 상단 확장 벽 |
| `Wall_Right_Ext` | `{x: 2.4, y: 13.5, z: 0}` | `{x: 0.2, y: 21, z: 1}` | `BoxCollider2D {x: 1, y: 1}` | 0 | 확인 안 됨 | 상단 확장 벽 |
| `DeadZone` | `{x: 0, y: 2.5, z: 0}` | `{x: 5, y: 0.1, z: 1}` | `BoxCollider2D {x: 1, y: 1}` | 1 | 확인 안 됨 | `DeadZone.cs`, `targetTag: Fruit` |

| Camera | 씬 | Orthographic | Size | Position | 화면비 대응 |
|---|---|---:|---:|---|---|
| `Main Camera` | `TitleScene` | 1 | 5 | `{x: 0, y: 0, z: -10}` | 확인 안 됨 |
| `Main Camera` | `GameScene` | 1 | 4.8 | `{x: 0, y: 0, z: -10}` | `CameraFit.cs`: `targetHalfWidth: 2.7`, `minSize: 4.6` |

| 프로젝트 설정 | 값 |
|---|---|
| `defaultScreenOrientation` | 0 |
| `allowedAutorotateToPortrait` | 1 |
| `allowedAutorotateToPortraitUpsideDown` | 1 |
| `allowedAutorotateToLandscapeRight` | 1 |
| `allowedAutorotateToLandscapeLeft` | 1 |
| `androidMaxAspectRatio` | 2.4 |
| WebGL 설정 | 일부 기본값 존재 (`webGLTemplate: APPLICATION:Default` 등) |
| WebGL Build Profile | 확인 안 됨. `Android™.asset`만 확인 |

## 1-3. 게임 규칙

| 항목 | 실제 파일 기준 |
|---|---|
| 합체 함수 | `Fruit.OnCollisionEnter2D` |
| 합체 조건 | `hasMerged == false`, 자기 자신 `isDropped == true`, 상대가 `Fruit`, 상대 `isDropped == true`, level 동일 |
| 중복 방지 | `this.GetInstanceID() < otherFruit.GetInstanceID()`인 쪽만 처리 |
| 합체 위치 | 두 과일 위치 평균 |
| 다음 단계 생성 | `nextLevelPrefab != null`이면 생성 후 `isDropped = true` |
| 합체 후 힘 | 새 과일에 `Vector2.up * 2f`, `ForceMode2D.Impulse` |
| 일반 점수 공식 | `10 * (level + 1)` |
| 최종 점수 | `finalMergeScore = 100` |
| 합체 효과 | `MergeEffect.prefab` 생성 |
| 합체 사운드 | `SoundManager.Instance.PlayMergeSound()` |
| 큰 합체 카메라 흔들림 | `level >= 3`이면 `Shake(0.15f, level * 0.05f)` |
| 게임 오버 판정 | `DeadZone` 안에 `Fruit`가 하나라도 있으면 타이머 증가 |
| 데드존 체류 시간 | `timeLimit: 7` |
| 카운트다운 유예 표시 | 남은 시간 `5`초 이하부터 표시 (`countdownStart: 5`) |
| 유예 리셋 | 데드존 내부 과일 수가 0이면 `timer = 0f` |
| 시작 과일 범위 | `startFruitRange: 5`, `Random.Range(0, 5)`이므로 `Fruit_01~Fruit_05` |
| 스폰 위치 | 기본 `{x: 0, y: 3.7, z: 0}` |
| 조작 x 범위 | `xLimit: 1.9`, 마우스 world x를 `[-1.9, 1.9]`로 clamp |
| 드롭 | UI 위가 아닌 마우스/터치 입력에서 Rigidbody2D `isKinematic = false`, 아래 impulse `1` |
| 다음 과일 지연 | `Invoke("SpawnNextFruit", 1.0f)` |

## 1-4. 흔들기 스킬

| 항목 | 실제 파일 기준 |
|---|---|
| 함수 | `GameManager.OnClickShakeSkill()` |
| 사용 조건 | `shakeCount > 0` |
| 사용 실패 메시지 | `Out of Shakes!` |
| 사용 시 차감 | `shakeCount--` |
| 카메라 흔들림 | `CameraShake.Instance.Shake(0.5f, 0.5f)` |
| 대상 | `GameObject.FindGameObjectsWithTag("Fruit")` |
| 제외 조건 | `fruit.transform.position.y >= deadZoneY` 또는 Rigidbody2D 없음 |
| `deadZoneY` | 2.5 |
| 힘 방향 | 중앙 방향 X `Clamp(-x, -1, 1)` + 랜덤 `[-0.25, 0.25]`, Y `-1`, normalize |
| 힘 크기 | `shakeForce: 30` |
| 질량 보정 | 있음. `dir * shakeForce * rb.mass` |
| 토크 | `Random.Range(-5f, 5f)` impulse |

## 1-5. 경제 시스템

| 항목 | 실제 파일 기준 |
|---|---|
| 코인 초기화 | `currentCoins = 0` |
| 기본 흔들기 수 | `startShakeCount: 1` |
| 코인 공식 | `currentCoins += amount / 10`, 정수 나눗셈 |
| 일반 합체 코인 | `level + 1` |
| 최종 합체 코인 | 10 |
| 흔들기 가격 | `shakePrice: 20` |
| 구매 성공 | 코인 20 차감, `shakeCount++` |
| 구매 실패 | `Not enough coins!` |
| 코인 저장 | PlayerPrefs 저장 안 함 |
| 흔들기 수 저장 | PlayerPrefs 저장 안 함 |
| 최고 점수 저장 | `PlayerPrefs.SetInt("BestScore", currentScore)`, `PlayerPrefs.Save()` |

## 1-6. 에셋/사운드

| 에셋 | 종류 | 확인된 용도 |
|---|---|---|
| `Gemini_Generated_Image_1.png` | Sprite | `Fruit_01`, next preview 0 |
| `Gemini_Generated_Image_2.png` | Sprite | `Fruit_02`, next preview 1 |
| `Gemini_Generated_Image_3.png` | Sprite | `Fruit_03`, next preview 2 |
| `Gemini_Generated_Image_4.png` | Sprite | `Fruit_04`, next preview 3 |
| `Gemini_Generated_Image_5.png` | Sprite | `Fruit_05`, next preview 4 |
| `Gemini_Generated_Image_6.png` | Sprite | `Fruit_06` |
| `Gemini_Generated_Image_7.png` | Sprite | `Fruit_07` |
| `Gemini_Generated_Image_8.png` | Sprite | `Fruit_08` |
| `Gemini_Generated_Image_9.png` | Sprite | `Fruit_09` |
| `Gemini_Generated_Image_10.png` | Sprite | `Fruit_10` |
| `Gemini_Generated_Image_11.png` | Sprite | `Fruit_11` |
| `AI_SUIKA_GAME.png` | Image | 타이틀 메인 이미지 |
| `unnamed.jpg` | Image | 배경 이미지 |
| `btn_frame.png` | UI Sprite | 버튼 프레임 |
| `ring.png` | UI Sprite | 데드존 카운트다운 링 |
| `Btn_Label_Outline.mat` | Material | 버튼 라벨/TMP 스타일 |
| `Msg_Alert.mat` | Material | 안내 메시지 스타일 |
| `AI_BGM.mp3` | AudioClip | BGM, loop, volume 0.5 |
| `AI_Drop_SFX.mp3` | AudioClip | 드롭 효과음, volume scale 0.7 |
| `AI_Merge_SFX.mp3` | AudioClip | 합체 효과음 |
| `MergeEffect.prefab` | Prefab | 합체 이펙트 |

## 1-7. 스크립트 전수

| 파일 | 역할 한 줄 요약 | 핵심 여부 |
|---|---|---|
| `CameraFit.cs` | 화면비에 따라 orthographic size를 조정해 가로 반폭을 유지 | 핵심 |
| `CameraShake.cs` | 카메라 localPosition을 랜덤 흔들고 원위치 | 핵심 |
| `DeadZone.cs` | 데드존 체류 시간, 카운트다운, 게임 오버 처리 | 핵심 |
| `DisplayHighscore.cs` | PlayerPrefs `BestScore` 표시 | 보조 |
| `Fruit.cs` | 동일 레벨 과일 충돌 합체, 점수, 이펙트, 사운드 처리 | 핵심 |
| `GameManager.cs` | 스폰/드롭, 점수/코인/상점/흔들기/옵션 총괄 | 핵심 |
| `MainTitle.cs` | 시작 버튼에서 `GameScene` 로드 | 보조 |
| `SoundManager.cs` | BGM과 효과음 재생 | 핵심 |

## 2. 제출 조건 대조

| 질문 | 판단 | 근거 |
|---|---|---|
| 웹 이식 제출이 조건에 맞는가 | 가능 | 기존 프로젝트 활용 가능 조건에 맞음. 단 챌린지 기간 신규 개발 내용을 명기해야 함 |
| 지금 상태 그대로 제출 가능한가 | 불가 | APK는 있으나 브라우저 실행 웹 빌드/링크가 확인 안 됨 |
| 필수 링크 | 미충족 | 별도 승인/로그인 없이 접근 가능한 플레이 링크 확인 안 됨 |
| 게임 제목 | 부분 충족 가능 | `productName: AI_subak_game` 확인 |
| 200자 소개 | 미충족 | 제출용 문구 확인 안 됨 |
| 썸네일 | 미충족 | 후보 이미지는 있으나 제출용 16:9 썸네일 확인 안 됨 |
| 조작법/실행 방법 안내 | 미충족 | 웹 제출 안내문 확인 안 됨 |
| Codex 활용 | 이후 충족 가능 | 이번 분석과 다음 이식 구현 과정을 명기 가능 |

| 챌린지 기간 신규 개발로 적을 수 있는 내용 | 설명 |
|---|---|
| 원본 Unity 분석 | 실제 프리팹/씬/스크립트 수치 기반 이식 사양화 |
| HTML5/JS 웹판 | 브라우저에서 바로 실행되는 독립 구현 |
| 9:16 반응형 처리 | 모바일/데스크톱 세로 캔버스 대응 |
| 물리 재현/튜닝 | scale/mass/radius/friction/bounce 기반 재현 |
| 흔들기/코인 시스템 웹 구현 | 원본 오리지널 시스템을 웹으로 이식 |
| 제출 패키징 | 썸네일, 소개, 조작법, 데모 영상, Codex 활용 설명 |

## 3. 이식 방식 검토

| 방식 | 가능성 | 내가 직접 할 수 있는 작업 | 소요/리스크 | 물리 차이 위험 | 9:16 처리 |
|---|---|---|---|---|---|
| A) Unity WebGL 빌드 | 가능성은 있음. 현재 WebGL 산출물/Build Profile은 확인 안 됨 | 원본은 읽기 전용이라 직접 수정/빌드 불가. 별도 복사본과 Unity WebGL Build Support가 필요 | 빠르면 반나절~1일, 환경 문제 시 1~3일. 모듈/용량/로딩/MIME/모바일 메모리 리스크 | 낮음. Unity Physics2D 유지 | Unity canvas를 9:16 컨테이너에 넣고 레터박스 처리 |
| B) 웹 기술로 재구현 | 충분히 가능 | 현재 빈 폴더에 독립 웹 게임 구현 가능 | MVP 1~3일, 튜닝 포함 3~7일. 물리 감각 튜닝 리스크 | 중간~높음. Unity Physics2D와 웹 엔진 solver 차이 | CSS `aspect-ratio: 9 / 16`, `100dvh` 기반 중앙 세로 캔버스 |

| B 권장 스택 | 판단 |
|---|---|
| 렌더링 | `Phaser 3` 또는 `PixiJS` |
| 물리 엔진 | 추천: `Matter.js` (`Phaser 3` 내장 Matter 사용 가능) |
| 프로젝트 | `Vite + TypeScript` 또는 규모 축소 시 순수 HTML/CSS/JS |
| 저장 | `localStorage`로 `BestScore` 대응 |
| 검증 | Playwright 모바일/데스크톱 스크린샷, 물리 튜닝, 링크 접근성 확인 |

| 결론 | 근거 |
|---|---|
| B) 웹 기술로 재구현 추천 | 원본 읽기 전용 조건을 지키면서 현재 폴더에 제출 가능한 웹 게임을 만들 수 있음. 챌린지 기간 신규 개발 내용과 Codex 협업 과정을 가장 명확히 남길 수 있음 |
| A를 택할 조건 | 별도 복사본, Unity 6000.3.19f1, WebGL Build Support, 호스팅 테스트 시간이 모두 준비되어 있고 원본 물리 충실도가 최우선일 때 |

## 확인 포인트 결론

| 확인 포인트 | 결론 |
|---|---|
| 과일 11단계 수치가 전부 실제 파일 값인가? | 예. `Fruit_01~11.prefab`과 `.meta` GUID 대조로 확인 |
| 제출 조건 중 지금 상태로 못 맞추는 항목이 있는가? | 예. 웹 실행 링크/웹 빌드/제출용 소개/썸네일/조작 안내가 아직 없음 |
| A와 B 중 어느 쪽을 왜 추천하는가? | B 추천. 원본 보존 조건과 현재 폴더 작업 조건에 맞고, 제출 가능한 웹 링크를 만들기 가장 직접적임 |

## 핵심 스크립트 전체 코드


| File | Full code |
|---|---|
| `Fruit.cs` | Code block below |

```csharp
using UnityEngine;

public class Fruit : MonoBehaviour
{
    [Header("--- ?댄럺??---")]
    public GameObject mergeEffectPrefab; // ?⑹껜 ???앹꽦???댄럺??    [Tooltip("??怨쇱씪???덈꺼 (0: 泥대━, 1: ?멸린 ...)")]
    public int level;

    [Tooltip("?⑹껜 ???앹꽦???ㅼ쓬 ?④퀎 怨쇱씪 ?꾨━??(理쒖쥌 怨쇱씪? 鍮꾩썙??")]
    public GameObject nextLevelPrefab;

    [Header("--- 理쒖쥌 怨쇱씪 諛몃윴??---")]
    [Tooltip("理쒖쥌 怨쇱씪?쇰━ ?⑹퀜???뚮㈇????二쇰뒗 蹂대꼫???먯닔")]
    [SerializeField] private int finalMergeScore = 100;

    [Tooltip("?ㅼ젣濡??ы븯?먮뒗吏 (?湲?以묒씤 怨쇱씪? false ???⑹껜?섏? ?딆쓬)")]
    public bool isDropped = false;

    private bool hasMerged = false; // 以묐났 ?⑹껜 諛⑹? ?뚮옒洹?
    void OnCollisionEnter2D(Collision2D collision)
    {
        // 1. ?대? ?⑹껜 泥섎━ 以묒씠硫?臾댁떆 (?숈떆 異⑸룎 諛⑹?)
        if (hasMerged) return;

        // 2. ?꾩쭅 ?ы븯?섏? ?딆? ?湲?怨쇱씪? ?대뼡 寃쎌슦?먮룄 ?⑹껜 ????        if (!isDropped) return;

        // 3. 遺?ろ엺 ?곷?媛 'Fruit' ?ㅽ겕由쏀듃瑜?媛吏怨??덈뒗吏 ?뺤씤
        Fruit otherFruit = collision.gameObject.GetComponent<Fruit>();

        // 4. ?곷???'?ы븯?? 媛숈? ?덈꺼 怨쇱씪???뚮쭔 ?⑹껜 (?湲?怨쇱씪? ?곷??щ룄 ?쒖쇅)
        if (otherFruit != null && otherFruit.isDropped && otherFruit.level == this.level)
        {
            // ??怨쇱씪???쒕줈瑜??⑹튂??????InstanceID 鍮꾧탳濡???履쎈쭔 泥섎━
            if (this.GetInstanceID() < otherFruit.GetInstanceID())
            {
                Merge(otherFruit);
            }
        }
    }

    void Merge(Fruit other)
    {
        // ??怨쇱씪??'?⑹껜 ?꾨즺' ?곹깭濡??좉툑
        this.hasMerged = true;
        other.hasMerged = true;

        // 4. ??怨쇱씪??以묎컙 ?꾩튂 怨꾩궛
        Vector3 spawnPos = (this.transform.position + other.transform.position) / 2;

        // [怨듯넻] ?댄럺??+ ?ъ슫???ъ깮 (吏꾪솕??理쒖쥌 ?뚮㈇?대뱺 ??긽)
        if (mergeEffectPrefab != null)
        {
            Instantiate(mergeEffectPrefab, spawnPos, Quaternion.identity);
        }
        SoundManager.Instance.PlayMergeSound();

        // [怨듯넻] ?덈꺼 3 ?댁긽? 移대찓???붾뱾湲?        if (level >= 3)
        {
            float shakePower = (level * 0.05f);
            CameraShake.Instance.Shake(0.15f, shakePower);
        }

        // 5. 遺꾧린: ?ㅼ쓬 ?④퀎媛 ?덉쑝硫?吏꾪솕, ?놁쑝硫?理쒖쥌) ?????뚮㈇ + 蹂대꼫??        if (nextLevelPrefab != null)
        {
            // (吏꾪솕) ?ㅼ쓬 ?④퀎 怨쇱씪 ?앹꽦
            GameObject newFruit = Instantiate(nextLevelPrefab, spawnPos, Quaternion.identity);

            // ?대? ?먯뿉 ?덈뒗 怨쇱씪?대?濡??앹꽦 利됱떆 '?ы븯?? 泥섎━ ??諛붾줈 ?뺤긽 ?⑹껜 媛??            Fruit newFruitComp = newFruit.GetComponent<Fruit>();
            if (newFruitComp != null) newFruitComp.isDropped = true;

            Rigidbody2D rb = newFruit.GetComponent<Rigidbody2D>();
            if (rb != null) rb.AddForce(Vector2.up * 2f, ForceMode2D.Impulse);

            // ?쇰컲 ?⑹껜 ?먯닔: 10 * (level + 1)
            int scoreToAdd = 10 * (level + 1);
            GameManager.Instance.AddScore(scoreToAdd);

            Debug.Log($"{level}?덈꺼 怨쇱씪 ?⑹껜 吏꾪솕!");
        }
        else
        {
            // (理쒖쥌) ?ㅼ쓬 怨쇱씪??留뚮뱾吏 ?딄퀬 ?????뚮㈇ + 蹂대꼫???먯닔
            GameManager.Instance.AddScore(finalMergeScore);

            Debug.Log($"理쒖쥌 怨쇱씪 ?⑹껜! ?????뚮㈇ + 蹂대꼫??{finalMergeScore}??);
        }

        // 6. ?먮낯 怨쇱씪 ??媛??쒓굅
        Destroy(this.gameObject);
        Destroy(other.gameObject);
    }
}

```


| File | Full code |
|---|---|
| `GameManager.cs` | Code block below |

```csharp
using System.Collections;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    private void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);

        Time.timeScale = 1;
    }

    [Header("--- 怨쇱씪/?ㅽ룿 ---")]
    public GameObject[] fruitPrefabs;
    public Sprite[] fruitSprites;
    public float spawnY = 4.0f;
    public float xLimit = 2.4f;

    [Header("--- ?쒖옉 怨쇱씪 ---")]
    [Tooltip("?쒖옉 ???깆옣???섏쐞 怨쇱씪 醫낅쪟 ??(?? 5 = 泥대━~媛?")]
    [SerializeField] private int startFruitRange = 5;

    [Header("--- UI 李몄“ ---")]
    public TMP_Text scoreText;
    public TMP_Text bestScoreText;
    public GameObject gameOverPanel;
    public Image nextFruitImage;

    [Header("--- ?듭뀡/蹂쇰ⅷ UI ---")]
    public GameObject optionPanel;
    public Slider volumeSlider;

    [Header("--- 肄붿씤/?ㅽ궗 UI ---")]
    public TMP_Text coinText;          // 肄붿씤 ?쒖떆 ?띿뒪??    public TMP_Text shakeCountText;    // ?붾뱾湲??ㅽ궗 ?잛닔 ?쒖떆 ?띿뒪??    public GameObject shopPanel;       // ?곸젏 ?붾㈃ ?⑤꼸
    public Button skillButton;         // ?ㅽ궗 ?ъ슜 踰꾪듉
    public TMP_Text messageText;       // ?덈궡 硫붿떆吏 (援щℓ ?ㅽ뙣/?ㅽ궗 ?놁쓬 ??

    [Header("--- 硫붿떆吏 ---")]
    [Tooltip("?덈궡 硫붿떆吏媛 ?붾㈃???좎??섎뒗 ?쒓컙(珥?")]
    [SerializeField] private float messageDuration = 1.5f;

    [Header("--- 寃쎌젣 諛몃윴??(?몄뒪?숉꽣 議곗젅) ---")]
    [Tooltip("?ㅽ궗 1??援щℓ 媛寃?(肄붿씤)")]
    [SerializeField] private int shakePrice = 20;
    [Tooltip("寃뚯엫 ?쒖옉 ??湲곕낯 ?ㅽ궗 ?잛닔")]
    [SerializeField] private int startShakeCount = 1;

    [Header("--- ?붾뱾湲??ㅽ궗 諛몃윴??(?몄뒪?숉꽣 議곗젅) ---")]
    [Tooltip("?꾨옒濡??뚮윭 ?대뒗 ?멸린 (????띾룄, 吏덈웾怨?臾닿??섍쾶 ?곸슜)")]
    [SerializeField] private float shakeForce = 30f;
    [Tooltip("??Y蹂대떎 ???곕뱶議???嫄몄튇 怨쇱씪? ?붾뱾湲???곸뿉???쒖쇅")]
    [SerializeField] private float deadZoneY = 2.5f;

    // 寃뚯엫 ?곹깭
    private GameObject currentFruitObj;
    private int nextFruitIndex;
    private bool isReady = false;

    private int currentScore = 0;

    // 肄붿씤/?ㅽ궗 ?곹깭 (留???珥덇린????PlayerPrefs ???濡쒕뱶 ????
    private int currentCoins = 0;
    private int shakeCount = 0;

    void Start()
    {
        // 1. 理쒓퀬 ?먯닔留?PlayerPrefs濡?怨꾩냽 ?좎?
        int bestScore = PlayerPrefs.GetInt("BestScore", 0);
        UpdateBestScoreUI(bestScore);

        // 2. 肄붿씤怨??ㅽ궗 ?잛닔??留???珥덇린??(肄붿씤 0, ?ㅽ궗? 湲곕낯媛?
        currentCoins = 0;
        shakeCount = startShakeCount;

        UpdateScoreUI();
        UpdateCoinUI();
        UpdateShakeCountUI();

        if (gameOverPanel != null) gameOverPanel.SetActive(false);
        if (optionPanel != null) optionPanel.SetActive(false);
        if (shopPanel != null) shopPanel.SetActive(false);
        if (messageText != null) messageText.gameObject.SetActive(false);

        if (volumeSlider != null)
        {
            volumeSlider.value = AudioListener.volume;
            volumeSlider.onValueChanged.AddListener(SetVolume);
        }

        nextFruitIndex = Random.Range(0, startFruitRange);
        SpawnNextFruit();
    }

    void Update()
    {
        if (Time.timeScale == 0 || !isReady) return;

        if (currentFruitObj != null)
        {
            Vector3 mousePos = Input.mousePosition;
            mousePos.z = 10;
            Vector3 worldPos = Camera.main.ScreenToWorldPoint(mousePos);

            float clampX = Mathf.Clamp(worldPos.x, -xLimit, xLimit);
            currentFruitObj.transform.position = new Vector3(clampX, spawnY, 0);
        }

        // UI 踰꾪듉(?듭뀡/?곸젏/?붾뱾湲??? ?꾨? ?대┃??寃쎌슦??怨쇱씪???⑥뼱?⑤━吏 ?딆쓬
        if (Input.GetMouseButtonDown(0) && !IsPointerOverUI())
        {
            DropFruit();
        }
    }

    // 留덉슦???ъ씤?곌? UI ?붿냼 ?꾩뿉 ?덈뒗吏 寃??    private bool IsPointerOverUI()
    {
        return EventSystem.current != null && EventSystem.current.IsPointerOverGameObject();
    }

    void SpawnNextFruit()
    {
        Vector3 spawnPos = new Vector3(0, spawnY, 0);
        currentFruitObj = Instantiate(fruitPrefabs[nextFruitIndex], spawnPos, Quaternion.identity);

        Rigidbody2D rb = currentFruitObj.GetComponent<Rigidbody2D>();
        if (rb != null) rb.isKinematic = true;

        nextFruitIndex = Random.Range(0, startFruitRange);

        if (nextFruitImage != null && nextFruitIndex < fruitSprites.Length)
        {
            nextFruitImage.sprite = fruitSprites[nextFruitIndex];
        }

        isReady = true;
    }

    void DropFruit()
    {
        if (currentFruitObj == null) return;

        Rigidbody2D rb = currentFruitObj.GetComponent<Rigidbody2D>();
        if (rb != null)
        {
            rb.isKinematic = false;
            SoundManager.Instance.PlayDropSound();
            rb.AddForce(Vector2.down * 1f, ForceMode2D.Impulse);
        }

        // ?ы븯?섎뒗 ?쒓컙遺???⑹껜 ?먯젙 ?덉슜 (?湲?以묒뿏 ?⑹퀜吏吏 ?딆쓬)
        Fruit fruitComp = currentFruitObj.GetComponent<Fruit>();
        if (fruitComp != null) fruitComp.isDropped = true;

        currentFruitObj = null;
        isReady = false;

        Invoke("SpawnNextFruit", 1.0f);
    }

    // --- ?먯닔 ?띾뱷 + 肄붿씤 ?곷┰ (?먯닔??1/10, 踰꾨┝) ---
    public void AddScore(int amount)
    {
        currentScore += amount;

        // 肄붿씤? ?먯닔??1/10 (?뺤닔 ?섎닓??= 踰꾨┝). ???⑥쐞????ν븯吏 ?딆쓬.
        currentCoins += (amount / 10);

        UpdateScoreUI();
        UpdateCoinUI();

        int currentBest = PlayerPrefs.GetInt("BestScore", 0);
        if (currentScore > currentBest)
        {
            PlayerPrefs.SetInt("BestScore", currentScore);
            PlayerPrefs.Save();
            UpdateBestScoreUI(currentScore);
        }
    }

    void UpdateScoreUI() { if (scoreText != null) scoreText.text = "Score: " + currentScore; }
    void UpdateBestScoreUI(int score) { if (bestScoreText != null) bestScoreText.text = "Best: " + score; }

    void UpdateCoinUI() { if (coinText != null) coinText.text = "coin : " + currentCoins; }
    void UpdateShakeCountUI() { if (shakeCountText != null) shakeCountText.text = "count : " + shakeCount; }

    public void GameOver()
    {
        if (gameOverPanel != null) gameOverPanel.SetActive(true);
        Time.timeScale = 0;
    }

    public void RestartGame()
    {
        Time.timeScale = 1;
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }

    // --- ?듭뀡 愿??---
    public void OpenOption() { if (optionPanel != null) optionPanel.SetActive(true); Time.timeScale = 0; }
    public void CloseOption() { if (optionPanel != null) optionPanel.SetActive(false); Time.timeScale = 1; }
    public void GoToMainMenu() { Time.timeScale = 1; SceneManager.LoadScene("TitleScene"); }
    public void SetVolume(float volume) { AudioListener.volume = volume; }

    // --- ?곸젏 愿??---
    public void OpenShop() { if (shopPanel != null) shopPanel.SetActive(true); Time.timeScale = 0; }
    public void CloseShop() { if (shopPanel != null) shopPanel.SetActive(false); Time.timeScale = 1; }

    public void BuyShakeSkill()
    {
        if (currentCoins >= shakePrice)
        {
            currentCoins -= shakePrice;
            shakeCount++;

            // 肄붿씤/?ㅽ궗 ?잛닔?????⑥쐞 ??PlayerPrefs ??ν븯吏 ?딆쓬
            UpdateCoinUI();
            UpdateShakeCountUI();
        }
        else
        {
            // 肄붿씤 遺議??덈궡
            ShowMessage("Not enough coins!");
        }
    }

    // --- ?덈궡 硫붿떆吏: ?좉퉸 ?꾩썱?ㅺ? ?먮룞?쇰줈 ?щ씪吏?(timeScale 0?먯꽌???숈옉) ---
    private Coroutine messageRoutine;

    public void ShowMessage(string msg)
    {
        if (messageText == null) return;

        messageText.text = msg;
        messageText.gameObject.SetActive(true);

        if (messageRoutine != null) StopCoroutine(messageRoutine);
        messageRoutine = StartCoroutine(HideMessageAfter(messageDuration));
    }

    private IEnumerator HideMessageAfter(float seconds)
    {
        // ?곸젏/?듭뀡? Time.timeScale = 0 ?곹깭??Realtime?쇰줈 ?湲고빐????        yield return new WaitForSecondsRealtime(seconds);
        if (messageText != null) messageText.gameObject.SetActive(false);
        messageRoutine = null;
    }

    // --- ?붾뱾湲??ㅽ궗: ?곕뱶議??꾨옒 怨쇱씪留??꾨옒+以묒븰?쇰줈 ?뚮윭 ?닿린 (?꾨줈 ???? ---
    public void OnClickShakeSkill()
    {
        if (shakeCount <= 0)
        {
            // ?⑥? ?ㅽ궗???놁쑝硫??덈궡 ??醫낅즺
            ShowMessage("Out of Shakes!");
            return;
        }

        // 1. ?잛닔 李④컧 (???⑥쐞 ??????놁쓬)
        shakeCount--;
        UpdateShakeCountUI();

        // 2. ?붾㈃ ?붾뱾湲?        CameraShake.Instance.Shake(0.5f, 0.5f);

        // 3. ?곕뱶議??꾨옒 怨쇱씪留?"?꾨옒 + 以묒븰"?쇰줈 ?뚮윭 ?댁쓬 (?덈? ?꾨줈 ???寃?
        GameObject[] fruits = GameObject.FindGameObjectsWithTag("Fruit");
        foreach (GameObject fruit in fruits)
        {
            // (a) ?곕뱶議댁뿉 嫄몄튇 ?꾪뿕??怨쇱씪? ?쒖쇅
            if (fruit.transform.position.y >= deadZoneY) continue;

            Rigidbody2D rb = fruit.GetComponent<Rigidbody2D>();
            if (rb == null) continue;

            // (b) ?섑룊? ?붾㈃ 以묒븰(x=0)?쇰줈, ?섏쭅? ??긽 ?꾨옒濡?(?꾩そ ?깅텇 ?놁쓬)
            float toCenterX = Mathf.Clamp(-fruit.transform.position.x, -1f, 1f);
            Vector2 dir = new Vector2(toCenterX + Random.Range(-0.25f, 0.25f), -1f).normalized;

            // (c) 吏덈웾怨?臾닿??섍쾶 媛숈? ?띾룄濡쒕쭔 ?뚮윭 ?닿린 (媛踰쇱슫 怨쇱씪 ??＜ 諛⑹?)
            rb.AddForce(dir * shakeForce * rb.mass, ForceMode2D.Impulse);
            rb.AddTorque(Random.Range(-5f, 5f), ForceMode2D.Impulse);
        }
    }
}

```


| File | Full code |
|---|---|
| `DeadZone.cs` | Code block below |

```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class DeadZone : MonoBehaviour
{
    [Header("Settings")]
    public string targetTag = "Fruit";  // 媛먯????쒓렇 ?대쫫
    public float timeLimit = 7.0f;      // 寃뚯엫?ㅻ쾭源뚯? 珥??쒓컙 (7珥? ?됰꼮?섍쾶)
    [Tooltip("?⑥? ?쒓컙????媛??댄븯媛 ?섎㈃ 移댁슫?몃떎???쒖떆 (洹??꾩뿏 議곗슜???꾩쟻)")]
    public float countdownStart = 5.0f; // ?⑥? 5珥덈???移댁슫?몃떎???쒖옉

    [Header("Countdown UI (?곕뱶議?移댁슫?몃떎??")]
    [Tooltip("移댁슫?몃떎???꾩껜瑜?耳쒓퀬 ?꾨뒗 猷⑦듃 ?ㅻ툕?앺듃")]
    public GameObject countdownRoot;
    [Tooltip("?쒓컙???곕씪 以꾩뼱?쒕뒗 ?먰삎 留?(Image Type=Filled, Radial360)")]
    public Image countdownRing;
    [Tooltip("?⑥? 珥덈? ?쒖떆?섎뒗 ?띿뒪??)]
    public TMP_Text countdownText;
    [Tooltip("?レ옄 ?꾩뒪(而ㅼ죱???묒븘吏? 媛뺣룄")]
    public float pulseAmount = 0.15f;
    [Tooltip("?レ옄 ?꾩뒪 ?띾룄")]
    public float pulseSpeed = 8f;

    [Header("Debug Info")]
    [SerializeField] private float timer = 0f; // ?꾩옱 ?꾩쟻 ?쒓컙 ?뺤씤??
    // ?꾩옱 ?곕뱶議??덉뿉 癒몃Т??怨쇱씪?ㅼ쓣 媛쒕퀎 異붿쟻
    private readonly HashSet<GameObject> fruitsInside = new HashSet<GameObject>();

    private void Start()
    {
        // ?쒖옉 ??移댁슫?몃떎?댁? ?④?
        if (countdownRoot != null) countdownRoot.SetActive(false);
    }

    // 怨쇱씪???곕뱶議댁뿉 ?ㅼ뼱?ㅻ㈃ ?깅줉
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag(targetTag))
        {
            fruitsInside.Add(collision.gameObject);
        }
    }

    // 怨쇱씪???곕뱶議댁쓣 鍮좎졇?섍?硫??대떦 怨쇱씪留??쒓굅
    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.CompareTag(targetTag))
        {
            fruitsInside.Remove(collision.gameObject);
        }
    }

    private void Update()
    {
        // ?뚭눼???⑹껜/?뚮㈇?? 怨쇱씪? ?먮룞 ?뺣━
        fruitsInside.RemoveWhere(f => f == null);

        // ?곕뱶議댁뿉 怨쇱씪???섎굹?쇰룄 ?덉쑝硫??쒓컙 ?꾩쟻, ?섎굹???놁쑝硫?由ъ뀑
        if (fruitsInside.Count > 0)
        {
            timer += Time.deltaTime;

            float remaining = Mathf.Max(0f, timeLimit - timer);

            // ?⑥? ?쒓컙??countdownStart ?댄븯???뚮쭔 移댁슫?몃떎???쒖떆
            if (remaining <= countdownStart) ShowCountdown(remaining);
            else HideCountdown();

            if (timer >= timeLimit)
            {
                Debug.Log("寃뚯엫 ?ㅻ쾭!");
                HideCountdown();
                GameManager.Instance.GameOver();
            }
        }
        else
        {
            timer = 0f;
            HideCountdown();
        }
    }

    private void ShowCountdown(float remaining)
    {
        if (countdownRoot != null && !countdownRoot.activeSelf)
            countdownRoot.SetActive(true);

        // 留? 移댁슫?몃떎??援ш컙(countdownStart) 湲곗??쇰줈 梨꾩썙吏?(5珥덉뿉 苑?李?-> 0?먯꽌 鍮?
        if (countdownRing != null)
            countdownRing.fillAmount = countdownStart > 0f ? Mathf.Clamp01(remaining / countdownStart) : 0f;

        // ?レ옄: ?⑥? 珥??щ┝) + ?꾩뒪
        if (countdownText != null)
        {
            countdownText.text = Mathf.CeilToInt(remaining).ToString();
            float pulse = 1f + pulseAmount * Mathf.Abs(Mathf.Sin(Time.unscaledTime * pulseSpeed));
            countdownText.transform.localScale = Vector3.one * pulse;
        }
    }

    private void HideCountdown()
    {
        if (countdownRoot != null && countdownRoot.activeSelf)
            countdownRoot.SetActive(false);
    }
}

```


| File | Full code |
|---|---|
| `CameraFit.cs` | Code block below |

```csharp
using UnityEngine;

// ?붾㈃鍮꾩뿉 ?곕씪 orthographicSize瑜?議곗젙??"蹂댁씠??媛濡?????湲곌린? 臾닿??섍쾶 ?쇱젙?섍쾶 ?좎?.
// ??orthographicSize留?嫄대뱶由щŉ Transform(?꾩튂)? ?덈? 留뚯?吏 ?딆쓬 ??CameraShake? 異⑸룎 ?놁쓬.
[ExecuteAlways]
[RequireComponent(typeof(Camera))]
public class CameraFit : MonoBehaviour
{
    [Tooltip("?붾㈃ 醫뚯슦濡?蹂댁뿬以??붾뱶 諛섑룺. 踰쎌씠 짹2.4?대?濡?2.7?대㈃ ?묒쁿??0.3???ъ쑀.")]
    [SerializeField] private float targetHalfWidth = 2.7f;

    [Tooltip("orthographicSize 理쒖냼媛? 媛濡쒓? ?볦? ?붾㈃(?쒕툝由?PC 媛濡??먯꽌 ?몃줈媛 ?섎━??寃?諛⑹?. " +
             "floor(y=-4)쨌spawnY(3.7)媛 ??긽 ?붾㈃ ?덉뿉 ?ㅼ뼱?ㅻ룄濡??섎뒗 ?덉쟾?μ튂.")]
    [SerializeField] private float minSize = 4.6f;

    private Camera cam;
    private int lastWidth;
    private int lastHeight;

    void Awake()
    {
        cam = GetComponent<Camera>();
        Apply(); // ?쒖옉 利됱떆 1???곸슜
    }

    void Update()
    {
        // ?댁긽???붾㈃ 鍮꾩쑉)媛 諛붾?寃쎌슦?먮쭔 ?ш퀎????留??꾨젅??怨꾩궛 湲덉?
        if (Screen.width != lastWidth || Screen.height != lastHeight)
        {
            Apply();
        }
    }

    private void Apply()
    {
        if (cam == null) cam = GetComponent<Camera>();
        if (cam == null || !cam.orthographic) return;

        // ?몃줈(orthographicSize)瑜?議곗젅??媛濡???쓣 怨좎젙
        float fitSize = targetHalfWidth / cam.aspect;

        // minSize ?대옩?? 媛濡쒓? ?볦? ?붾㈃?먯꽑 fitSize媛 ?묒븘???몃줈媛 ?섎━誘濡??섑븳 蹂댁옣
        cam.orthographicSize = Mathf.Max(fitSize, minSize);

        lastWidth = Screen.width;
        lastHeight = Screen.height;
    }
}

```


| File | Full code |
|---|---|
| `CameraShake.cs` | Code block below |

```csharp
using UnityEngine;
using System.Collections;

public class CameraShake : MonoBehaviour
{
    public static CameraShake Instance;

    // 원래 카메라 위치 저장용
    private Vector3 originalPos;

    void Awake()
    {
        if (Instance == null) Instance = this;
    }

    void Start()
    {
        originalPos = transform.localPosition;
    }

    // 외부에서 부를 함수: "0.2초 동안, 0.3의 강도로 흔들어라!"
    public void Shake(float duration, float magnitude)
    {
        StartCoroutine(ShakeCoroutine(duration, magnitude));
    }

    IEnumerator ShakeCoroutine(float duration, float magnitude)
    {
        float elapsed = 0.0f;

        while (elapsed < duration)
        {
            // 랜덤한 위치로 카메라를 미친듯이 이동
            float x = Random.Range(-1f, 1f) * magnitude;
            float y = Random.Range(-1f, 1f) * magnitude;

            transform.localPosition = new Vector3(originalPos.x + x, originalPos.y + y, originalPos.z);

            elapsed += Time.deltaTime;

            // 다음 프레임까지 대기
            yield return null;
        }

        // 흔들기 끝났으면 원래 위치로 복귀 (중요!)
        transform.localPosition = originalPos;
    }
}
```


| File | Full code |
|---|---|
| `SoundManager.cs` | Code block below |

```csharp
using UnityEngine;

public class SoundManager : MonoBehaviour
{
    public static SoundManager Instance;

    [Header("--- 오디오 소스 ---")]
    public AudioSource sfxPlayer; // 효과음 재생기
    public AudioSource bgmPlayer; // 배경음악 재생기

    [Header("--- 오디오 클립 (소리 파일) ---")]
    public AudioClip mergeSound;  // 합체 소리
    public AudioClip dropSound;   // 과일 떨어지는 소리
    public AudioClip bgmSound;    // 배경음악

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    void Start()
    {
        // 배경음악 자동 재생
        if (bgmSound != null && bgmPlayer != null)
        {
            bgmPlayer.clip = bgmSound;
            bgmPlayer.loop = true; // 무한 반복
            bgmPlayer.volume = 0.5f; // 너무 시끄러우면 줄여
            bgmPlayer.Play();
        }
    }

    // 외부에서 부를 함수: "합체 소리 내!"
    public void PlayMergeSound()
    {
        if (sfxPlayer != null && mergeSound != null)
        {
            // PlayOneShot: 소리가 겹쳐도 끊기지 않고 겹쳐서 재생됨 (중요!)
            sfxPlayer.PlayOneShot(mergeSound);
        }
    }

    public void PlayDropSound()
    {
        if (sfxPlayer != null && dropSound != null)
        {
            sfxPlayer.PlayOneShot(dropSound, 0.7f); // 약간 작게
        }
    }
}
```


| File | Full code |
|---|---|
| `MainTitle.cs` | Code block below |

```csharp
using UnityEngine;
using UnityEngine.SceneManagement; // ???대룞???꾪빐 ?꾩닔

public class MainTitle : MonoBehaviour
{
    // ?쒖옉 踰꾪듉???곌껐???⑥닔
    public void ClickStart()
    {
        // ?ㅼ젣 寃뚯엫 ???대쫫怨??뺥솗???쇱튂?댁빞 ??        SceneManager.LoadScene("GameScene");
    }
}

```


| File | Full code |
|---|---|
| `DisplayHighscore.cs` | Code block below |

```csharp
using UnityEngine;
using TMPro;

public class DisplayHighscore : MonoBehaviour
{
    public TMP_Text scoreText;

    void Start()
    {
        // 저장된 점수 불러오기 (없으면 0)
        int bestScore = PlayerPrefs.GetInt("BestScore", 0);

        if (scoreText != null)
            scoreText.text = "Best: " + bestScore;
    }
}
```



