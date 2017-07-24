<?php


class SamiDocBlockNode
{
    protected $shortDesc;
    protected $longDesc;
    protected $tags = array();
    protected $errors = array();

    public function addTag($token, $value)
    {
        $this->tags[$token][] = $value;
    }

    public function getTags()
    {
        return $this->tags;
    }

    public function getOtherTags()
    {
        $tags = $this->tags;
        unset($tags['requestParam'], $tags['param'], $tags['return'], $tags['var'], $tags['throws']);

        return $tags;
    }

    public function getTag($token)
    {
        return isset($this->tags[$token]) ? $this->tags[$token] : array();
    }

    public function getShortDesc()
    {
        return $this->shortDesc;
    }

    public function getLongDesc()
    {
        return $this->longDesc;
    }

    public function setShortDesc($shortDesc)
    {
        $this->shortDesc = $shortDesc;
    }

    public function setLongDesc($longDesc)
    {
        $this->longDesc = $longDesc;
    }

    public function getDesc()
    {
        return $this->shortDesc."\n\n".$this->longDesc;
    }

    public function addError($error)
    {
        $this->errors[] = $error;
    }

    public function getErrors()
    {
        return $this->errors;
    }
}
