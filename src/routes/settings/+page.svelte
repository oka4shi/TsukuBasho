<script lang="ts">
  import { deleteIdb } from "$lib/idb";
  import { PUBLIC_IDB_NAME } from "$env/static/public";

  type Course = { code: string; name: string };
  type College = { code: string; name: string; courses?: Course[] };
  type School = { code: string; name: string; colleges: College[] };
  const schools: School[] = [
    {
      code: "A",
      name: "人文・文化学群",
      colleges: [
        {
          code: "B",
          name: "人文学類",
          courses: [
            {
              code: "6",
              name: "哲学"
            },
            {
              code: "7",
              name: "史学"
            },
            {
              code: "8",
              name: "考古学・民俗学"
            },
            {
              code: "9",
              name: "言語学"
            }
          ]
        },
        {
          code: "C",
          name: "比較文化学類",
          courses: []
        },
        {
          code: "E",
          name: "日本語・日本文化学類"
        }
      ]
    },
    {
      code: "B",
      name: "社会・国際学群",
      colleges: []
    },
    {
      code: "C",
      name: "人間学群",
      colleges: []
    },
    {
      code: "E",
      name: "生命環境学群",
      colleges: []
    },
    {
      code: "E",
      name: "生命環境学群",
      colleges: []
    },
    {
      code: "F",
      name: "理工学群",
      colleges: []
    },
    {
      code: "G",
      name: "情報学群",
      colleges: []
    },
    {
      code: "V",
      name: "グローバル教育院",
      colleges: []
    },
    {
      code: "W",
      name: "体育専門学群",
      colleges: []
    },
    {
      code: "Y",
      name: "芸術専門学群",
      colleges: []
    },
    {
      code: "U",
      name: "学際サイエンス・デザイン専門学群",
      colleges: []
    }
  ];
</script>

<h1>設定</h1>
<p>各種設定が行えます</p>

<h2>学群・学類・主専攻の登録</h2>
<p>
  学群・学類・主専攻を登録することで、より関連度の高い授業が提案されるようになります
</p>

<p>登録したデータを削除します。この操作は取り消せませんので、ご注意ください</p>
<h2>データをリセットする</h2>
<p>登録したデータを削除します。この操作は取り消せませんので、ご注意ください</p>
<button
  type="button"
  onclick={() => {
    deleteIdb(PUBLIC_IDB_NAME || "TsukuBasho");
  }}>リセット</button
>
